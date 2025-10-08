import express from "express";
import { getProgramCategories } from "../../../../controllers/user/v1/program_categories/programCategoriesController.js";

const router = express.Router();

router.get("/", getProgramCategories);

export default router;
