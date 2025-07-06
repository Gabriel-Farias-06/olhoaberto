/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import { logger, scrapeDOU } from "./utils";
import mongoose from "mongoose";
import amqplib from "amqplib";
import { BROKER } from "./db/broker";
import cron from "node-cron";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "dev"}`),
});

mongoose.connect(process.env.MONGO_DB_URL!).then(async () => {
  logger("-=-=-=-=-=-=-= DATA FEEDER STARTED -=-=-=-=-=-=-=");

  const broker = await amqplib.connect(process.env.RBTMQ_BROKER ?? "");
  BROKER.value = broker;
  scrapeDOU();
});

cron.schedule("0 8 * * 1-5", async () => {
  const broker = await amqplib.connect(process.env.RBTMQ_BROKER ?? "");
  BROKER.value = broker;
  scrapeDOU();
});
