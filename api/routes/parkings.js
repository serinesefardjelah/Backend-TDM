const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Parking = require("../models/parking");
const upload = require("../middleware/multer");
const cloudinary = require("../utils/cloudinary");
const defaultParkingImageUrl =
  "https://res.cloudinary.com/dplvqzogl/image/upload/v1715002629/parking-app/duhp6ay0nxztbzlqqfm9.jpg";

//get all parkings
router.get("/", (req, res, next) => {
  Parking.find()
    // .select("name price capacity image description longitude latitude city")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        parkings: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            capacity: doc.capacity,
            image: doc.image,
            description: doc.description,
            longitude: doc.longitude,
            latitude: doc.latitude,
            city: doc.city,

            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/parkings/" + doc._id,
            },
          };
        }),
      };
      console.log(docs);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//create a parking
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    let img = defaultParkingImageUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "parking-app",
      });
      img = result.secure_url;
    }

    const {
      name,
      price,
      capacity,
      reserved,
      city,
      latitude,
      longitude,
      description,
    } = req.body;

    const parking = new Parking({
      _id: new mongoose.Types.ObjectId(),
      name,
      price,
      capacity,
      reserved,
      image: img,
      city,
      latitude,
      longitude,
      description,
    });

    const savedParking = await parking.save();

    res.status(200).json({
      message: "Parking created successfully",
      createdParking: savedParking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while creating parking",
    });
  }
});

//get parking by id
router.get("/:parkingId", (req, res, next) => {
  const id = req.params.parkingId;
  Parking.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
