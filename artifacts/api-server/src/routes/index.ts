import { Router, type IRouter } from "express";
import healthRouter from "./health";
import investorsRouter from "./investors";

const router: IRouter = Router();

router.use(healthRouter);
router.use(investorsRouter);

export default router;
