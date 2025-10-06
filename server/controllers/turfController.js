import Turf from "../models/Turf.js";

// 🟢 CREATE TURF
export const createTurf = async (req, res) => {
  try {
    const { name, location, description, pricePerHour, availableSlots, images } = req.body;

    const turf = await Turf.create({
      name,
      location,
      description,
      pricePerHour,
      availableSlots,
      images,
      admin: req.user._id,
    });

    res.status(201).json({ message: "Turf added successfully!", turf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 GET ALL TURFS (Public)
export const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find({ isApproved: true }).populate("admin", "name email");
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟣 GET MY TURFS (Admin Only)
export const getMyTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find({ admin: req.user._id });
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟠 UPDATE TURF (Admin)
export const updateTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    if (turf.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this turf" });
    }

    const updatedTurf = await Turf.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ message: "Turf updated", turf: updatedTurf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 DELETE TURF
export const deleteTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    if (turf.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this turf" });
    }

    await turf.deleteOne();
    res.json({ message: "Turf deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 SUPERADMIN - APPROVE TURF
export const approveTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    turf.isApproved = true;
    await turf.save();

    res.json({ message: "Turf approved successfully", turf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }await sendEmail({
  to: turf.admin.email,
  subject: "Turf Approved",
  text: `Hi ${turf.admin.name}, your turf "${turf.name}" has been approved by SuperAdmin.`,
});

};
