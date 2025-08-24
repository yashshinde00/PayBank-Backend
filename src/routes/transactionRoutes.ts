import { Router } from "express";
import { createTransaction, getBalance, getTransaction } from "../controller/transactioncontroller";
import { authToken } from "../middlewares/authToken";


const router = Router();
router.get("/", authToken, getTransaction);
router.get("/balance", authToken, getBalance);
router.post("/", authToken, createTransaction);


export default router;