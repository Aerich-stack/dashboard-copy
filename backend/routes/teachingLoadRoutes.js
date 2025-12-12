import express from "express";
import * as TeachingLoadController from "../controllers/TeachingLoadController.js";

const router = express.Router();

// Initialize tables
router.post("/init", TeachingLoadController.initializeTables);

// Teaching Load CRUD routes
router.post("/", TeachingLoadController.createTeachingLoad);
router.get("/", TeachingLoadController.getAllTeachingLoads);
router.get("/teacher/:teacherId", TeachingLoadController.getTeacherTeachingLoad);
router.get("/:id", TeachingLoadController.getTeachingLoadById);
router.put("/:id", TeachingLoadController.updateTeachingLoad);
router.delete("/:id", TeachingLoadController.deleteTeachingLoad);

export default router;
