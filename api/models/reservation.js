const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parking",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  vehicle: { type: String, required: true },
});

module.exports = mongoose.model("Reservation", reservationSchema);
