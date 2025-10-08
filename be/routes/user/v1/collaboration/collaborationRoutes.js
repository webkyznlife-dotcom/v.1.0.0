import express from "express";
import { getCollaborations } from "../../../../controllers/user/v1/collaboration/collaborationController.js";

const router = express.Router();

router.get("/", getCollaborations);

export default router;
