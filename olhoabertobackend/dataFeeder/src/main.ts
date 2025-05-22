/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import { connectDb } from "./db";
import { logger, scrapeDOU } from "./utils";
dotenv.config();

connectDb().then(async () => {
  logger("-=-=-=-=-=-=-= DATA FEEDER STARTED -=-=-=-=-=-=-=");
  await scrapeDOU();
});

// searches for new data each 10 minutes
// cron.schedule("*/1 * * * *", getGeneralData);
