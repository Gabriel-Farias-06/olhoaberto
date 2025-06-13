/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import { logger, scrapeDOU } from "./utils";
import mongoose from "mongoose";
import amqplib from "amqplib";
import { BROKER } from "./db/broker";
dotenv.config();

mongoose.connect(process.env.MONGO_DB_URL!).then(async () => {
  logger("-=-=-=-=-=-=-= DATA FEEDER STARTED -=-=-=-=-=-=-=");
  // import

  const broker = await amqplib.connect(process.env.RBTMQ_BROKER ?? "");
  BROKER.value = broker;
  scrapeDOU();
});

// searches for new data each 10 minutes
// cron.schedule("*/1 * * * *", getGeneralData);
