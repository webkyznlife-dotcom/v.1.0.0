import express from "express";
import { 
  getAllBranchesForSelectOptionAdmin,
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  deleteMultipleBranches
} from "../../../../../controllers/admin/v1/location/branch_list/branchController.js";

import { upload } from "../../../../../middleware/uploadMiddleware.js";

const router = express.Router();

// GET all court
router.get("/", getAllBranches);

// GET all branches for select option (Admin)
router.get("/for-select", getAllBranchesForSelectOptionAdmin);

// CREATE a court
router.post(
  "/create",
  upload.fields([
    { name: "mbi_image", maxCount: 10 } // <-- multiple images untuk Court
  ]),
  createBranch
);

// UPDATE a court
router.put(
  "/update/:mb_id",
  upload.fields([
    { name: "mbi_image", maxCount: 10 }
  ]),
  updateBranch
);

// SOFT DELETE a court
router.delete("/delete/:mb_id", deleteBranch);

// SOFT DELETE court
router.post("/delete-multiple", deleteMultipleBranches);

export default router;
