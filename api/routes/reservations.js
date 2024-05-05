const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");

const Reservation = require("../models/reservation");
const Parking = require("../models/parking");

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

router.post("/", checkAuth, (req, res, next) => {
  Parking.findById(req.body.parkingId)
    .then((parking) => {
      if (!parking) {
        return res.status(404).json({
          message: "parking not found",
        });
      }
      const reservation = new Reservation({
        _id: new mongoose.Types.ObjectId(),
        parkingId: req.body.parkingId,
        date: req.body.date,
        time: req.body.time,
        duration: req.body.duration,
        vehicle: req.body.vehicle,
        user: req.body.user,
      });
      return reservation.save();
    })

    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "reservation stored",
        createdReservation: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

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


//TODO: update reservation (needed for status maybe)

module.exports = router;
