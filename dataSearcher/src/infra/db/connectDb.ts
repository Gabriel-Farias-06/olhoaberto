import { logger } from "@/utils";
import mongoose from "mongoose";

async function connectDb() {
  try {
    console.log(process.env.MONGO_DB_URL);
    await mongoose.connect(process.env.MONGO_DB_URL!);
    logger("MongoDB connected!");
  } catch (error) {
    logger(`MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

export default connectDb;
