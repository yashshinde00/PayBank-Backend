import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.users.findMany({
      where: { role: "Customer" },
      select: { id: true, username: true },
      orderBy: { username: "asc" },
    });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCustomerTransactions = async (req: Request, res: Response) => {
  try {
    const customerIdStr = req.params.customerId;
    if (!customerIdStr) return res.status(400).json({ message: "Missing customer ID param" });

    const customerId = parseInt(customerIdStr);
    if (isNaN(customerId)) return res.status(400).json({ message: "Invalid customer ID" });

    const transactions = await prisma.accounts.findMany({
      where: { UserId: customerId },
      orderBy: { id: "desc" },
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

