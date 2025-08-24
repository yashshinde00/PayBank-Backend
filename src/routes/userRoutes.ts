
import { signup,signin } from "../controller/usercontroller";
import { Router } from "express";
import { signinValidation, signupValidation } from "../middlewares/validation";

const router = Router();

router.post("/signup",signupValidation,signup)
router.post("/signin",signinValidation ,signin)




export default router;