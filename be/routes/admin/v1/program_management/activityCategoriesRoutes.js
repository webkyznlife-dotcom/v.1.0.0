import express from "express";
import { getActivityCategories, updateActivityCategory, createActivityCategory, deleteActivityCategory, deleteMultipleActivityCategories } from "../../../../controllers/admin/v1/program_management/activityCategoriesController.js";

const router = express.Router();

router.get("/", getActivityCategories);
router.post("/create", createActivityCategory);
router.delete("/delete/:mpac_id", deleteActivityCategory);
router.put("/update/:mpac_id", updateActivityCategory);
router.post("/delete-multiple", deleteMultipleActivityCategories);

export default router;
