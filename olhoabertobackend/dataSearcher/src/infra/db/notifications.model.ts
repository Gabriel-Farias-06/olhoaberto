/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema } from "mongoose";

// === ALERT MODEL ===
const NotificationsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  alert: {
    type: Schema.Types.ObjectId,
    ref: "Alert",
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
  },
});

const Notifications = mongoose.model("Notifications", NotificationsSchema);
export default Notifications;
