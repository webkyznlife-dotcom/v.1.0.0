import express from "express";
import { 
  getCourt, 
  getCourtForSelect,
  createCourt, 
  updateCourt, 
  deleteCourt, 
  deleteMultipleCourt 
} from "../../../../../controllers/admin/v1/courts_management/court/courtController.js";

import { upload } from "../../../../../middleware/uploadMiddleware.js";

const router = express.Router();

// GET all court
router.get("/", getCourt);

// GET all court for select
router.get("/for-select", getCourtForSelect);

// CREATE a court
router.post(
  "/create",
  upload.fields([
    { name: "mci_image", maxCount: 10 } // <-- multiple images untuk Court
  ]),
  createCourt
);

// UPDATE a court
router.put(
  "/update/:mc_id",
  upload.fields([
    { name: "mci_image", maxCount: 10 }
  ]),
  updateCourt
);

// SOFT DELETE a court
router.delete("/delete/:mc_id", deleteCourt);

// SOFT DELETE court
router.post("/delete-multiple", deleteMultipleCourt);

export default router;
