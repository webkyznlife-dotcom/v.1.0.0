import express from "express";
import { insertVisitor } from "../../../../controllers/user/v1/visitor/visitorController.js"; 

const router = express.Router();

router.post("/insert-visitor", insertVisitor);

export default router;