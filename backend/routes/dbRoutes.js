import express from "express";
import DbController from "../controllers/DbController.js";

const router = express.Router();

router.post('/ensure-schema', DbController.ensureSchema);
router.get('/schema/:table', DbController.showTableCreate);

export default router;
