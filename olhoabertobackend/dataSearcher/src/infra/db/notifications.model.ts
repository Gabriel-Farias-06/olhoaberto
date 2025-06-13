/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema } from "mongoose";

// === ALERT MODEL ===
const NotificationsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  alert: {
    type: Schema.Types.ObjectId,
    ref: "Alerts",
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
  },
});

const Notifications = mongoose.model("Notifications", NotificationsSchema);
export default Notifications;
