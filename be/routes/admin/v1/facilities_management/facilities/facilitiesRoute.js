import express from "express";
import { 
  getFacility, 
  getFacilityForSelect,
  createFacility, 
  updateFacility, 
  deleteFacility, 
  deleteMultipleFacility
} from "../../../../../controllers/admin/v1/facilities_management/facilities/facilitiesController.js";

const router = express.Router();

// GET all facilities
router.get("/", getFacility);

// GET all facilities for select
router.get("/for-select", getFacilityForSelect);

// CREATE a facility
router.post("/create", createFacility);

// UPDATE a facility by mf_id
router.put("/update/:mf_id", updateFacility);

// SOFT DELETE a facility by mf_id
router.delete("/delete/:mf_id", deleteFacility);

// SOFT DELETE multiple facilities
router.post("/delete-multiple", deleteMultipleFacility);

export default router;
