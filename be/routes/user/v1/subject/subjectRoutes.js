import express from "express";
import { getSubjects } from "../../../../controllers/user/v1/subject/subjectController.js";

const router = express.Router();

router.get("/", getSubjects);

export default router;
