import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory, deleteMultipleCategories } from "../../../../controllers/admin/v1/program_management/categoriesController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/create", createCategory);
router.delete("/delete/:mpc_id", deleteCategory);
router.put("/update/:mpc_id", updateCategory);
router.post("/delete-multiple", deleteMultipleCategories);

export default router;