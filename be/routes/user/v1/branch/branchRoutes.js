import express from "express";
import { getBranchs, getBranchsDetail, getBranchFormatted } from "../../../../controllers/user/v1/branch/branchController.js";

const router = express.Router();

router.get("/", getBranchs);
router.get("/with-detail", getBranchsDetail);
router.get("/with-formatted", getBranchFormatted);



export default router;
