import express from "express";
import { getCourts, getCourtWithImages } from "../../../../controllers/user/v1/court/courtController.js";

const router = express.Router();

router.get("/", getCourts);
router.get("/with-images", getCourtWithImages);

export default router;
