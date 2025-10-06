import Booking from "../models/Booking.js";
import Turf from "../models/Turf.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

// 🟢 USER: Create Booking
export const createBooking = async (req, res) => {
  try {
    const { turfId, slot, date } = req.body;

    const turf = await Turf.findById(turfId);
    if (!turf || !turf.isApproved)
      return res.status(404).json({ message: "Turf not available" });

    // Check if slot is already booked
    const slotBooked = await Booking.findOne({
      turf: turfId,
      "slot.startTime": slot.startTime,
      "slot.endTime": slot.endTime,
      date,
      status: "confirmed",
    });

    if (slotBooked) return res.status(400).json({ message: "Slot already booked" });

    const booking = await Booking.create({
      user: req.user._id,
      turf: turfId,
      slot,
      date,
      price: turf.pricePerHour,
      status: "confirmed", // can later integrate pending → confirmed after payment
    });

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  await sendEmail({
  to: req.user.email,
  subject: "Booking Confirmed!",
  text: `Hi ${req.user.name}, your booking at ${booking.turf.name} is confirmed for ${booking.date} ${booking.slot.startTime}-${booking.slot.endTime}`,
});
};

// 🔵 USER: Get My Bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("turf", "name location pricePerHour")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟣 ADMIN: Get Bookings for My Turfs
export const getAdminBookings = async (req, res) => {
  try {
    const turfs = await Turf.find({ admin: req.user._id });
    const turfIds = turfs.map((t) => t._id);

    const bookings = await Booking.find({ turf: { $in: turfIds } })
      .populate("user", "name email")
      .populate("turf", "name location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 ADMIN/SUPERADMIN: Update Booking Status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // confirmed/cancelled
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Admin can update only their turf bookings
    if (req.user.role === "admin") {
      const turf = await Turf.findById(booking.turf);
      if (turf.admin.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking updated", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 SUPERADMIN: Get All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("turf", "name location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create Razorpay Order
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("turf");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const amount = booking.price * 100; // Amount in paise
    const options = {
      amount,
      currency: "INR",
      receipt: booking._id.toString(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const booking = await Booking.findById(bookingId);
      booking.status = "paid"; // mark as paid
      await booking.save();

      res.json({ message: "Payment verified & booking confirmed" });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  await sendEmail({
  to: req.user.email,
  subject: "Payment Successful",
  text: `Hi ${req.user.name}, your payment of ₹${booking.price} for turf ${booking.turf} was successful.`,
});

};
