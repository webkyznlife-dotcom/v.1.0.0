import express from "express";
import { getEvents, getEventsWithPagination, getEventDetailBySlug, getOtherEvents } from "../../../../controllers/user/v1/event/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/read", getEventDetailBySlug);
router.get("/with-pagination", getEventsWithPagination);
router.post("/other", getOtherEvents);

export default router;
