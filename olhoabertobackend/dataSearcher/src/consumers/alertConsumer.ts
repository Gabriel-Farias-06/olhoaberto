/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alerts, Articles, IAConfig, Notifications } from "@/infra/db";
import { LLMHub } from "@/infra/llm";
import { logger } from "@/utils";
import amqplib from "amqplib";
import { IncomingMessage, Server, ServerResponse } from "http";

export default async (
  io: Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  const conn = await amqplib.connect(process.env.RBTMQ_BROKER ?? "");
  const channel = await conn.createChannel();
  await channel.assertQueue("newArticles", { durable: true });

  console.info(" [*] Waiting for messages in newArticles queue");

  channel.consume("newArticles", async (msg: any) => {
    if (msg) {
      logger("Received newArticles event");
      console.log("MSG: ", msg);

      const alerts = await Alerts.find({}).lean();
      const llmHub = new LLMHub();
      const config = await IAConfig.findOne();

      for (const alert of alerts) {
        logger(`Verificando alerta: ${alert.title}`);
        const queryVector = await llmHub.embedQuery(
          `${alert.title} ${alert.description}`
        );

        const articles = await Articles.aggregate([
          {
            $vectorSearch: {
              index: process.env.VECTOR_INDEX!,
              path: "embedding",
              queryVector,
              numCandidates: 100,
              limit: 10,
            },
          },
        ]);

        logger(`${articles.length} encontrados`);

        if (articles.length > 0) {
          const stream = llmHub.stream(
            `Resuma os artigos relacionados a estritamente a: "${
              alert.title
            }: ${alert.description}" com base nas limitações: "${
              config?.instructions
            }". Organize em Markdown. Se não houver resultado, retorne nada. Artigos: ${JSON.stringify(
              articles
            )}`
          );

          let response = "";
          for await (const chunk of stream) {
            response += chunk;
          }
          console.log({ response });

          io.emit("alertResult", {
            userId: alert.user,
            description: alert.description,
            resultado: response,
          });

          await Notifications.create({
            alert: alert._id,
            content: response,
            date: new Date(),
            read: false,
            name: `${articles.length} Artigos relacionados à ${alert.title} encontrados`,
          });
        }
      }

      // channel.ack(msg);
    }
  });
};
