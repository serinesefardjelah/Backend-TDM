const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const cloudinary = require("cloudinary").v2;
//const upload = multer({ dest: "uploads/" });

cloudinary.config({
  cloud_name: "dplvqzogl",
  api_key: "961273486951599",
  api_secret: "E-rVAmYOw4QHol9ig-y3JAotQTw",
});

// const upload = multer({ storage: storage });
const Parking = require("../models/parking");

router.get("/", (req, res, next) => {
  Parking.find()
    .select("name price location capacity available reserved image description")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        parkings: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            location: doc.location,
            capacity: doc.capacity,
            available: doc.available,
            reserved: doc.reserved,
            image: doc.image,
            description: doc.description,
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

router.post("/", async (req, res, next) => {
  console.log(req.file);
  const img = 
 ` await cloudinary.uploader.upload("./uploads/" , {
    folder: "parking-app",
  });`
  const parking = new Parking({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    location: req.body.location,
    capacity: req.body.capacity,
    available: req.body.available,
    reserved: req.body.reserved,
    image: img.secure_url,
    description: req.body.description,
  });
  parking
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Handling POST requests to /parkings",
        createdParking: parking,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

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

router.patch("/:parkingId", (req, res, next) => {
  const id = req.params.parkingId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Parking.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;
