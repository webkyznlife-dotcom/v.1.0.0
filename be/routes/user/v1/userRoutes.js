import express from "express";
import { getUsers, createUser } from "../../../controllers/admin/v1/auth/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);

export default router;
