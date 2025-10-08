import express from "express";
import { 
  getBranchMaps, 
  createBranchMap, 
  updateBranchMap, 
  deleteBranchMap, 
  deleteMultipleBranchMap 
} from "../../../../../controllers/admin/v1/location/map/mapController.js";

const router = express.Router();

// GET all branch maps
router.get("/", getBranchMaps);

// CREATE a branch map
router.post("/create", createBranchMap);

// UPDATE a branch map by mbm_id
router.put("/update/:mbm_id", updateBranchMap);

// SOFT DELETE a branch map by mbm_id
router.delete("/delete/:mbm_id", deleteBranchMap);

// SOFT DELETE multiple branch maps
router.post("/delete-multiple", deleteMultipleBranchMap);

export default router;