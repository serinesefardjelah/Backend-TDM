const mongoose = require("mongoose");

const parkingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  // price: { type: Number, required: true },
  // location: { type: String, required: true },
  // capacity: { type: Number, required: true },
  // available: { type: Number, required: true },
  // reserved: { type: Number, required: true },
  image: { type: String, required: true },
  // description: { type: String, required: true },
});

module.exports = mongoose.model("Parking", parkingSchema);
