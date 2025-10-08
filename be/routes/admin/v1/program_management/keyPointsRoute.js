import express from "express";
import {
  getKeyPoints,
  createKeyPoint,
  updateKeyPoint,
  deleteKeyPoint,
  deleteMultipleKeyPoints,
} from "../../../../controllers/admin/v1/program_management/keyPointsController.js";

const router = express.Router();

// GET all key points (optional filter: mp_id, status)
router.get("/", getKeyPoints);

// CREATE key point
router.post("/create", createKeyPoint);

// UPDATE key point by id
router.put("/update/:mpkp_id", updateKeyPoint);

// DELETE (soft delete) key point by id
router.delete("/delete/:mpkp_id", deleteKeyPoint);

// DELETE multiple key points (soft delete)
router.post("/delete-multiple", deleteMultipleKeyPoints);

export default router; 
