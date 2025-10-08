import express from "express";
import { 
  getTrainer, 
  getTrainerForSelect,
  createTrainer, 
  updateTrainer, 
  deleteTrainer, 
  deleteMultipleTrainer 
} from "../../../../controllers/admin/v1/trainers/trainersController.js";

const router = express.Router();

// GET all trainers
router.get("/", getTrainer);

// GET all trainers for select (aktif)
router.get("/for-select", getTrainerForSelect);

// CREATE a trainer
router.post("/create", createTrainer);

// UPDATE a trainer
router.put("/update/:trainer_id", updateTrainer);

// SOFT DELETE a trainer
router.delete("/delete/:trainer_id", deleteTrainer);

// SOFT DELETE multiple trainers
router.post("/delete-multiple", deleteMultipleTrainer);

export default router;