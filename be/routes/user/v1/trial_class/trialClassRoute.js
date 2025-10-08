import express from "express";
import { createTrialClass } from "../../../../controllers/user/v1/free_trial/freeTrialController.js"; 

const router = express.Router();

router.post("/create", createTrialClass);

export default router;