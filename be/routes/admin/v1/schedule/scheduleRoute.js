import express from "express";
import { 
  getAllSchedule, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule, 
  deleteMultipleSchedule 
} from "../../../../controllers/admin/v1/schedule/scheduleController.js";

const router = express.Router();

// GET all schedules
router.get("/", getAllSchedule);

// CREATE a schedule
router.post("/create", createSchedule);

// UPDATE a schedule
router.put("/update/:tpsd_id", updateSchedule);

// SOFT DELETE a schedule
router.delete("/delete/:tpsd_id", deleteSchedule);

// SOFT DELETE multiple schedules
router.post("/delete-multiple", deleteMultipleSchedule);

export default router;