import express from "express";
import { 
  getCollaboration, 
  createCollaboration, 
  updateCollaboration, 
  deleteCollaboration, 
  deleteMultipleCollaboration 
} from "../../../../controllers/admin/v1/collaboration/collaborationController.js";
import { upload } from "../../../../middleware/uploadMiddleware.js";

const router = express.Router();

// GET all collaborations
router.get("/", getCollaboration);

// CREATE collaboration
router.post(
  "/create",
  upload.single("mc_image"), // field untuk upload image collaboration
  createCollaboration
);

// UPDATE collaboration
router.put(
  "/update/:mc_id",
  upload.single("mc_image"), // field untuk update image collaboration
  updateCollaboration
);

// DELETE single collaboration (soft delete)
router.delete("/delete/:mc_id", deleteCollaboration);

// DELETE multiple collaborations (soft delete)
router.post("/delete-multiple", deleteMultipleCollaboration);

export default router;
