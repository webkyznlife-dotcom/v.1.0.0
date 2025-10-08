import express from "express";
import { getPrograms, updateProgram, createProgram, deleteProgram, deleteMultiplePrograms, getProgramsForSelect } from "../../../../controllers/admin/v1/program_management/classesController.js";
import { upload } from "../../../../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getPrograms);
router.get("/for-select", getProgramsForSelect);
router.post(
  "/create",
  upload.fields([
    { name: "mp_header_image", maxCount: 1 },
    { name: "mp_thumbnail", maxCount: 1 },
    { name: "mpi_images", maxCount: 10 } // <-- multiple images untuk MstProgramImage
  ]),
  createProgram
);
router.delete("/delete/:mp_id", deleteProgram);
router.put(
  "/update/:mp_id",
  upload.fields([
    { name: "mp_header_image", maxCount: 1 },
    { name: "mp_thumbnail", maxCount: 1 },
    { name: "mpi_images", maxCount: 10 },
  ]),
  updateProgram
);
router.post("/delete-multiple", deleteMultiplePrograms);

export default router;