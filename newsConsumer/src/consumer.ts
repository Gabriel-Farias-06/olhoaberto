import { Kafka } from "kafkajs";
import { saveNews } from "./services";

async function runConsumer() {
  const { KAFKA_BROKER } = process.env;

  const kafka = new Kafka({ clientId: "news-app", brokers: [KAFKA_BROKER!] });
  const consumer = kafka.consumer({ groupId: "news-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "news", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message: { value, offset }, topic, partition }) => {
      try {
        if (!value) throw new Error("Invalid message value");

        const { urls } = JSON.parse(value.toString());

        for (const [i, url] of urls.entries()) {
          // dealys digesting to avoid memory overflow
          setTimeout(async () => {
            await saveNews([url]);
          }, i * 15000);
        }
        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (Number(offset) + 1).toString(),
          },
        ]);
      } catch (error) {
        console.error(`Error ${(error as Error).message}`);
      }
    },
  });
}

export default runConsumer;
