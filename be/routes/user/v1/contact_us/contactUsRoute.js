import express from "express";
import { createContact } from "../../../../controllers/user/v1/contact_us/contactUsController.js"; 

const router = express.Router();

router.post("/create", createContact);

export default router;