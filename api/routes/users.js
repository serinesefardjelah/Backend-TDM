const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const upload = require("../middleware/multer");
const cloudinary = require("../utils/cloudinary");

require("dotenv").config();
const defaultUserImageUrl =
  "https://res.cloudinary.com/dplvqzogl/image/upload/v1715002629/parking-app/duhp6ay0nxztbzlqqfm9.jpg";

//signup
router.post("/signup", upload.single("image"), async (req, res, next) => {
  try {
    let img = defaultUserImageUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "parking-app",
      });
      img = result.secure_url;
    }
    User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Mail exists",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const { email, firstName, lastName, phone } = req.body;
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email,
                password: hash,
                firstName,
                lastName,
                phone,
                image: img,
              });
              user
                .save()
                .then((result) => {
                  console.log(result);
                  res.status(200).json({
                    message: "User created",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          });
        }
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "error saving image",
      error: err,
    });
  }
});

//login
router.post("/login", (req, res, next) => {
  const { email, password, fcmToken } = req.body; // Extract fcmToken along with email and password

  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          user[0].fcmToken = fcmToken;
          user[0]
            .save()
            .then(() => {
              return res.status(200).json({
                message: "Auth successfulllllll",
                token: token,
                fcmtoken: fcmToken,
                
              });
            })
            .catch((err) => {
              return res.status(500).json({
                error: err,
              });
            });
        } else {
          res.status(401).json({
            message: "Auth failed",
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/me", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);

  User.findById(decoded.userId)
    .select("-password") // Exclude the password field
    .exec()
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//TODO: Add the following routes:

// update user

module.exports = router;
