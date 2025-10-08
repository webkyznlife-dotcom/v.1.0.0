import express from "express";
import { login } from "../../../../controllers/user/v1/auth/authController.js";

const router = express.Router();

router.post("/login", login);

export default router;
