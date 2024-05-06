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
  entryTime: { type: Date, required: true },
  exitTime: { type: Date, required: true },
  place: { type: Number },
});

module.exports = mongoose.model("Reservation", reservationSchema);
