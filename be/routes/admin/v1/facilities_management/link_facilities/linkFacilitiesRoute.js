import express from "express";
import { 
  getBranchFacilities, 
  createBranchFacility, 
  updateBranchFacility, 
  deleteBranchFacility, 
  deleteMultipleBranchFacilities 
} from "../../../../../controllers/admin/v1/facilities_management/link_facilities/linkFacilitiesController.js";

const router = express.Router();

// GET all facilities
router.get("/", getBranchFacilities);

// CREATE a facility
router.post("/create", createBranchFacility);

// UPDATE a facility by mf_id
router.put("/update/:mbf_id", updateBranchFacility);

// SOFT DELETE a facility by mf_id
router.delete("/delete/:mbf_id", deleteBranchFacility);

// SOFT DELETE multiple facilities
router.post("/delete-multiple", deleteMultipleBranchFacilities);

export default router;
