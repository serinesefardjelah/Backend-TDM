const Reservation = require("../models/reservation");
const FirebaseToken = require("../models/token");
// Firebase Configuration
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const executeTask = async () => {
  try {
    console.log("Start executing the task");
    const currentTime = new Date();
    const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000);
    console.log(
      "Current time:",
      currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      "One hour from now:",
      oneHourFromNow
    );

    // Find reservations starting within the next hour
    const reservations = await Reservation.find({
      entryTime: { $gte: currentTime, $lte: oneHourFromNow },
      is_notified: { $ne: true },
    }).populate("userId");

    if (reservations.length) {
      console.log("Reservations:", reservations);
      for (const reservation of reservations) {
        notify(reservation);
      }
    } else {
      console.log("No reservations found");
    }
  } catch (error) {
    console.error("Error executing task:", error);
  }
};
const notify = async (reservation) => {
  try {
    const tokens = await FirebaseToken.find({ userId: reservation.userId });

    if (tokens.length) {
      console.log(
        `Notification: Reservation ${reservation._id} is starting soon.`
      );
      for (const tokenDoc of tokens) {
        const token = tokenDoc.token;
        const message = {
          notification: {
            title: "Parking Reservation is soon",
            body:
              "Your reservation is starting at " +
              reservation.entryTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
          },
          token: token,
        };

        try {
          const response = await admin.messaging().send(message);
          console.log("Notification sent successfully:", response);

          await Reservation.findByIdAndUpdate(reservation._id, {
            is_notified: true,
          });
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      }
    } else {
      console.log("No tokens found for the user");
    }
  } catch (error) {
    console.error("Error fetching tokens:", error);
  }
};
// const interval = 10 * 60 * 1000; // 10 minutes in milliseconds
const interval = 10 * 1000; // 10 seconds for testing

// Use setInterval to run the executeTask function every 10 minutes
setInterval(executeTask, interval);

module.exports = executeTask;
