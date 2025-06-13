import mongoose, { Schema } from "mongoose";

// === ALERT MODEL ===
const AlertsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  results: [
    {
      date: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      read: {
        type: Boolean,
        required: false,
      },
    },
  ],
});

const Alerts = mongoose.model("Alerts", AlertsSchema);
export default Alerts;
