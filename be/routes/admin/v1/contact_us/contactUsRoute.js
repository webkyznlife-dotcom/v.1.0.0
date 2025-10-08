import express from "express";
import { getContacts, updateContactStatus, updateMultipleContacts } from "../../../../controllers/admin/v1/contact_us/contactUsController.js";

const router = express.Router();

router.get("/", getContacts);
// Update status contact (single)
router.put("/update/:tc_id", updateContactStatus);
// Update status banyak contact sekaligus
router.post("/update-multiple", updateMultipleContacts);

export default router;