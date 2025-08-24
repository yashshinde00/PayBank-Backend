import { Request, Response } from "express";
import { PrismaClient  } from "@prisma/client";
import bcrypt from "bcrypt";

const client = new PrismaClient();
const saltRounds = 10;

function generateToken(len: number = 36): string {
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < len; i++) {
    token += char.charAt(Math.floor(Math.random() * char.length));
  }
  return token;
}


export const signup = async (req: Request, res: Response) => {
  try {
    let { username, password, role, bankerId } = req.body;

    if (typeof role === "string") role = role.trim();

    // const validRoles: Role[] = [Role.Customer, Role.Banker];
    const userRole = role

    console.log("Signup role received:", role, "-> userRole:", userRole);

    if (userRole === role) {
      if (!bankerId || typeof bankerId !== "string" || bankerId.trim() === "") {
        return res.status(400).json({ message: "Banker ID is required for bankers" });
      }

      const existingBankerId = await client.users.findFirst({ where: { bankerId } });
      if (existingBankerId) {
        return res.status(409).json({ message: "Banker ID already in use" });
      }
    } else {
      bankerId = null;
    }

    const existingUser = await client.users.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await client.users.create({
      data: {
        username,
        password: hashedPassword,
        role: userRole,
        bankerId,
      },
    });

    return res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};



export const signin = async (req: Request, res: Response) => {
  try {
    const { username, password, bankerId  } = req.body;
    let user
    if (bankerId) {
      user = await client.users.findFirst({ where: { username, bankerId } });
    } else {
      user = await client.users.findUnique({ where: { username } });
    }

    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password does not match" });
    }

    const accessToken = generateToken(36);

    await client.users.update({
      where: { id: user.id },
      data: { accessToken, tokenCreatedAt: new Date() },
    });

    return res.status(200).json({
      message: "Successfully signed in",
      accessToken,
      role: user.role,
      bankerId: user.bankerId || null
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
