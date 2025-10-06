import express from "express";
import {
  createTurf,
  getAllTurfs,
  getMyTurfs,
  updateTurf,
  deleteTurf,
  approveTurf,
} from "../controllers/turfController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getAllTurfs);

// Admin routes
router.post("/", protect, authorize("admin"), createTurf);
router.get("/my-turfs", protect, authorize("admin"), getMyTurfs);
router.put("/:id", protect, authorize("admin"), updateTurf);
router.delete("/:id", protect, authorize("admin"), deleteTurf);

// SuperAdmin route
router.put("/:id/approve", protect, authorize("superadmin"), approveTurf);

export default router;
