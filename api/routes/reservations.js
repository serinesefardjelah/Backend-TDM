const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");

const Reservation = require("../models/reservation");
const Parking = require("../models/parking");

//Get all reservations
router.get("/", checkAuth, (req, res, next) => {
  Reservation.find()
    // .select('') //add fields u want to select separated by spaces
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        reservations: docs,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//Create a reservation
router.post("/", checkAuth, async (req, res, next) => {
  const userId = req.userData.userId;

  try {
    const parking = await Parking.findById(req.body.parkingId);
    if (!parking) {
      return res.status(404).json({ message: "Parking not found" });
    }

    if (parking.availablePlaces <= 0) {
      return res.status(400).json({ message: "No available places" });
    }

    const reservation = new Reservation({
      _id: new mongoose.Types.ObjectId(),
      parkingId: req.body.parkingId,
      entryTime: req.body.entryTime,
      exitTime: req.body.exitTime,
      place: parking.availablePlaces,
      userId: userId,
    });

    parking.availablePlaces--;
    await parking.save();

    // Save the reservation
    const savedReservation = await reservation.save();

    res.status(200).json({
      message: "Reservation stored",
      createdReservation: savedReservation,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while storing reservation" });
  }
});

//Get reservation by id
router.get("/:reservationId", checkAuth, (req, res, next) => {
  const id = req.params.reservationId;
  Reservation.findById(id)
    .exec()
    .then((doc) => {
      console.log("From the DB ", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "NO valid reservation with such an ID" });
      }
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//Get reservation by user id
router.get("/:userId", checkAuth, (req, res, next) => {
  const id = req.params.userId;
  Reservation.find({ user: id })
    .exec()
    .then((doc) => {
      console.log("From the DB ", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "NO valid reservation with such an ID" });
      }
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//TODO:
// - update reservation (needed for status maybe)
// - generate QR code for reservationId

module.exports = router;
