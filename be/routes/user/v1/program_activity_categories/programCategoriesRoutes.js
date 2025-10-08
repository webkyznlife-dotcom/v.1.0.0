import express from "express";
import { getProgramActivityCategories } from "../../../../controllers/user/v1/program_activity_categories/programActivityCategoriesController.js";

const router = express.Router();

router.get("/", getProgramActivityCategories);

export default router;
