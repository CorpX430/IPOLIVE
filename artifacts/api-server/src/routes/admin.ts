import { Router } from "express";
import { db, investorsTable } from "@workspace/db";
import { UpdateInvestorStatusBody, UpdateInvestorStatusParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const ADMIN_PASSWORD = "$10$10$10";

const router = Router();

function checkAdminAuth(req: any, res: any): boolean {
  const pw = req.headers["x-admin-password"];
  if (pw !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized." });
    return false;
  }
  return true;
}

// GET /api/admin/investors — list all investors
router.get("/admin/investors", async (req, res) => {
  if (!checkAdminAuth(req, res)) return;

  try {
    const investors = await db
      .select()
      .from(investorsTable)
      .orderBy(investorsTable.createdAt);

    res.json(
      investors.map((inv) => ({
        id: inv.id,
        fullName: inv.fullName,
        email: inv.email,
        status: inv.status,
        createdAt: inv.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list investors");
    res.status(500).json({ error: "Something went wrong." });
  }
});

// PATCH /api/admin/investors/:id/status — update investor status
router.patch("/admin/investors/:id/status", async (req, res) => {
  if (!checkAdminAuth(req, res)) return;

  const paramsParsed = UpdateInvestorStatusParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid investor ID." });
    return;
  }

  const bodyParsed = UpdateInvestorStatusBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: "Invalid status." });
    return;
  }

  const { id } = paramsParsed.data;
  const { status } = bodyParsed.data;

  try {
    const [investor] = await db
      .update(investorsTable)
      .set({ status })
      .where(eq(investorsTable.id, id))
      .returning();

    if (!investor) {
      res.status(404).json({ error: "Investor not found." });
      return;
    }

    res.json({
      id: investor.id,
      fullName: investor.fullName,
      email: investor.email,
      status: investor.status,
      createdAt: investor.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update investor status");
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
