
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

    // Find reservations starting within the next hour
    const reservations = await Reservation.find({
      entryTime: { $gte: currentTime, $lte: oneHourFromNow },
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
            title: "Reservation",
            body: "Your reservation is starting soon",
          },
          token: token,
        };

        try {
          const response = await admin.messaging().send(message);
          console.log("Notification sent successfully:", response);

          // Update the reservation to indicate that the notification was sent
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

