import mongoose from "mongoose";

const IAConfigSchema = new mongoose.Schema({
  instructions: {
    type: String,
  },
});

const IAConfig = mongoose.model("IAConfig", IAConfigSchema);

export default IAConfig;
