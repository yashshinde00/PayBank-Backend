import { Router } from "express";
import userRoutes from "./userRoutes";
import transactionRoutes from "./transactionRoutes";
import bankerRoutes from "./bankerRoutes";

const router = Router();

router.use("/user", userRoutes);
router.use("/transactions", transactionRoutes);
router.use("/banker", bankerRoutes);

export default router;
