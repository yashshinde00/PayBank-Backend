import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ message: "Token missing" });

    const user = await prisma.users.findUnique({ where: { accessToken: token } });
    if (!user) return res.status(401).json({ message: "Invalid or expired token" });

    (req as any).user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
