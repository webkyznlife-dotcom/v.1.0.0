import express from "express";
import { 
  getEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  deleteMultipleEvents 
} from "../../../../controllers/admin/v1/event/eventController.js";
import { upload } from "../../../../middleware/uploadMiddleware.js";

const router = express.Router();

// GET all events
router.get("/", getEvents);

// CREATE event
router.post(
  "/create",
  upload.single("me_image_url"), // field untuk upload image event
  createEvent
);

// UPDATE event
router.put(
  "/update/:me_id",
  upload.single("me_image_url"), // field untuk update image event
  updateEvent
);

// DELETE single event (soft delete)
router.delete("/delete/:me_id", deleteEvent);

// DELETE multiple events (soft delete)
router.post("/delete-multiple", deleteMultipleEvents);

export default router;
