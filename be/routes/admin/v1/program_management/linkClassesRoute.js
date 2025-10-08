import express from "express";
import {
  getBranchsPrograms,
  getBranchsProgramsForSelect,
  createBranchsProgram,
  updateBranchsProgram,
  deleteBranchsProgram,
  deleteMultipleBranchsPrograms,
} from "../../../../controllers/admin/v1/program_management/linkClassesController.js";

const router = express.Router();

// GET all branch programs
router.get("/", getBranchsPrograms);

// GET active branch programs for select dropdown
router.get("/select", getBranchsProgramsForSelect);

// CREATE branch program
router.post("/create", createBranchsProgram);

// UPDATE branch program by id
router.put("/update/:mbp_id", updateBranchsProgram);

// DELETE (soft delete) branch program by id
router.delete("/delete/:mbp_id", deleteBranchsProgram);

// DELETE multiple branch programs (soft delete)
router.post("/delete-multiple", deleteMultipleBranchsPrograms);

export default router;
