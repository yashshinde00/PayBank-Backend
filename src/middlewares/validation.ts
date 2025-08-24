import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const signupValidation = [
  body("username").exists().withMessage("Username is required").isLength({ min: 3 }),
  body("password").exists().withMessage("Password is required").isLength({ min: 6 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const signinValidation = [
  body("username").exists().withMessage("Username is required"),
  body("password").exists().withMessage("Password is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
