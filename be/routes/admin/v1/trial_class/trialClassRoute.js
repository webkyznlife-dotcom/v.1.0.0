import express from "express";
import { getTrialClasses, updateTrialClassStatus, updateMultipleTrialClasses } from "../../../../controllers/admin/v1/free_trial/freeTrialController.js";

const router = express.Router();

router.get("/", getTrialClasses);
// Update status contact (single)
router.put("/update/:ttc_id", updateTrialClassStatus);
// Update status banyak contact sekaligus
router.post("/update-multiple", updateMultipleTrialClasses);

export default router;