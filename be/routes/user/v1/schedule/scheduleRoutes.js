import express from "express";
import { getSchedules, getSchedulesWithPagination, getSchedulesWithFilters, getSchedulesFromThirdParty, getWeeklySchedule, getWeeklyScheduleMobile } from "../../../../controllers/user/v1/schedule/scheduleController.js";

const router = express.Router();

router.get("/", getSchedules);
router.post("/for-external", getSchedulesFromThirdParty);
router.post("/formatted", getWeeklySchedule);
router.post("/formatted-mobile", getWeeklyScheduleMobile);


export default router;
