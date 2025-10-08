import express from "express";
import { getAgeGroups } from "../../../../controllers/user/v1/age_groups/ageGroupsController.js";

const router = express.Router();

router.get("/", getAgeGroups);

export default router;
