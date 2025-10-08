import express from "express";
import { getPrograms, getProgramsWithImages, getProgramsWithDetails, getProgramsForSelect, getProgramsWithPagination, getProgramDetailBySlug, getProgramsWithPaginationWithSearch, getProgramsWithSearch } from "../../../../controllers/user/v1/program/programController.js";
import { validateProgramSlug } from "../../../../middleware/validateProgramSlug.js";

const router = express.Router();

router.get("/", getPrograms);
router.get("/for-select", getProgramsForSelect);
router.get("/with-images", getProgramsWithImages);
router.get("/with-details", getProgramsWithDetails);
router.post("/with-pagination", getProgramsWithPagination);
router.post("/with-pagination-search", getProgramsWithPaginationWithSearch);
router.get("/:mp_slug", validateProgramSlug, getProgramDetailBySlug);
router.post("/with-search", getProgramsWithSearch);



export default router;
