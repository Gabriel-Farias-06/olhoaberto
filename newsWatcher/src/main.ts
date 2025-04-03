import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import { scrapeGoogleNewsLinks } from "./scrapper";
import logger from "./logger";
import cron from "node-cron";

dotenv.config();

const { KAFKA_BROKER } = process.env;

const kafka = new Kafka({
  clientId: "newsWatcher",
  brokers: [KAFKA_BROKER!],
});
const producer = kafka.producer();

async function sendArticleLink(urls: string[]) {
  logger("Sending to kafka...");

  // delay due to memory usage
  await producer.connect();
  await producer.send({
    topic: "news",
    messages: [
      {
        value: JSON.stringify({
          urls,
          timestamp: new Date().toISOString(),
        }),
      },
    ],
  });
  logger(`Sent: ${urls}`);
}

async function fetchAndSendNews() {
  try {
    logger("Fetching news...");
    const urls = await scrapeGoogleNewsLinks("global news");

    await sendArticleLink(urls);
    logger("Finished.");
  } catch (error) {
    console.error(error);
  }
}

// (async () => {
//   logger("-=-=-=-=-=-=-= NEWS WATCHER STARTED -=-=-=-=-=-=-=");
//   await sendArticleLink(["http://news.google.com"]);
// })();

// searches for new articles each 10 minutes
cron.schedule("*/1 * * * *", fetchAndSendNews);
