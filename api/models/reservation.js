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
  place: { type: Number },

  //make them required after testing
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reservation", reservationSchema);
