const mongoose = require("mongoose");

const parkingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  city: { type: String, required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model("Parking", parkingSchema);
