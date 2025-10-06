import express from "express";
import {
  createBooking,
  getMyBookings,
  getAdminBookings,
  updateBookingStatus,
  getAllBookings,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", protect, authorize("user"), createBooking);
router.get("/my-bookings", protect, authorize("user"), getMyBookings);

// Admin routes
router.get("/admin", protect, authorize("admin"), getAdminBookings);
router.put("/:id/status", protect, authorize("admin", "superadmin"), updateBookingStatus);

// SuperAdmin routes
router.get("/all", protect, authorize("superadmin"), getAllBookings);

export default router;
