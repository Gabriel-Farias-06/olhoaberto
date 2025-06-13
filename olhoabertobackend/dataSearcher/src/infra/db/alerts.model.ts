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
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const Alerts = mongoose.model("Alerts", AlertsSchema);
export default Alerts;
