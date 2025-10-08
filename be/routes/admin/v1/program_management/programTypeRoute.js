import express from "express";
import {getProgramTypeForSelect} from "../../../../controllers/admin/v1/program_management/programTypeController.js";

const router = express.Router();

router.get("/for-select", getProgramTypeForSelect);

export default router;