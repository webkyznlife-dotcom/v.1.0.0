import express from "express";
import { getAgeGroups, createAgeGroup, deleteAgeGroup, updateAgeGroup, deleteMultipleAgeGroups, getAgeGroupSelect } from "../../../../controllers/admin/v1/program_management/ageGroupsController.js";

const router = express.Router();

router.get("/", getAgeGroups);
router.get("/for-select", getAgeGroupSelect);
router.post("/create", createAgeGroup);
router.delete("/delete/:mpa_id", deleteAgeGroup);
router.put("/update/:mpa_id", updateAgeGroup);
router.post("/delete-multiple", deleteMultipleAgeGroups);

export default router;
