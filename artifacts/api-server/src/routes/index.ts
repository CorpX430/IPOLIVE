import { Router, type IRouter } from "express";
import healthRouter from "./health";
import investorsRouter from "./investors";
import authRouter from "./auth";
import stockRouter from "./stock";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(investorsRouter);
router.use(authRouter);
router.use(stockRouter);
router.use(adminRouter);

export default router;
