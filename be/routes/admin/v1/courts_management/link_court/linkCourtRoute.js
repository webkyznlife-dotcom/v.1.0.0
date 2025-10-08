import express from "express";
import { 
  getBranchCourts, 
  createBranchCourt, 
  updateBranchCourt, 
  deleteBranchCourt, 
  deleteMultipleBranchCourts 
} from "../../../../../controllers/admin/v1/courts_management/link_court/linkCourtController.js";

const router = express.Router();

// GET all branch courts
router.get("/", getBranchCourts);

// CREATE a branch court
router.post("/create", createBranchCourt);

// UPDATE a branch court by mbc_id
router.put("/update/:mbc_id", updateBranchCourt);

// SOFT DELETE a branch court by mbc_id
router.delete("/delete/:mbc_id", deleteBranchCourt);

// SOFT DELETE multiple branch courts
router.post("/delete-multiple", deleteMultipleBranchCourts);

export default router;