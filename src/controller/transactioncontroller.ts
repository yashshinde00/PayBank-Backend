// @ts-nocheck
import {  PrismaClient } from "@prisma/client";
import { Request, Response } from "express";


const client = new PrismaClient();
export const getTransaction = async(req: Request, res: Response) => {
    try {
        const user = (req as any).user
        if (!user) {
            return res.status(404).json({ message: "Unauthorized"})
        }
        const transaction = await client.accounts.findMany({
            where: { UserId: user.id },
            orderBy: {id: "desc"}
        })  
        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error fetching transactions", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const getBalance = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const transactions = await client.accounts.findMany({
      where: { UserId: user.id }
    });

    const balance = transactions.reduce(
      (acc, tx) => acc + Number(tx.deposits) - Number(tx.withdrawals),
      0
    );

    res.status(200).json({ balance });
  } catch (error) {
    console.error("Error fetching balance", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const createTransaction = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { type, amount } = req.body;
    if (!type || !["deposit", "withdraw"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Calculate current balance
    const transactions = await client.accounts.findMany({
      where: { UserId: user.id }
    });

    const currentBalance = transactions.reduce(
      (acc, tx) => acc + Number(tx.deposits) - Number(tx.withdrawals),
      0
    )

    if (type === "withdraw" && numericAmount > currentBalance) {
      return res.status(400).json({ message: "Insufficient Funds" });
    }

    const newTransaction = await client.accounts.create({
      data: {
        UserId: user.id,
        deposits: type === "deposit" ? numericAmount : 0,
        withdrawals: type === "withdraw" ? numericAmount : 0,
      }
    });

    res.status(201).json({ message: `${type} successful`, transaction: newTransaction });
  } catch (error) {
    console.error("Error creating transaction", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
