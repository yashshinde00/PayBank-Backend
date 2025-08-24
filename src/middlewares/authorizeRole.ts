import { Request, Response, NextFunction } from "express";

export const authorizeRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.role !== requiredRole)
      return res.status(403).json({ message: "Forbidden: insufficient rights" });
    
    if (requiredRole === "Banker" && (!user.bankerId || user.bankerId.trim() === "")) {
      return res.status(403).json({ message: "Forbidden: bankerId required for banker role" });
    }
    next();
  };
};
