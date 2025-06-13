/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alerts, Articles, IAConfig } from "@/infra/db";
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

      const alerts = await Alerts.find({});
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

          const newResult = {
            date: new Date().toISOString(),
            answer: response,
            read: false, // opcional
          };

          alert.results.push(newResult);
          await alert.save();
        }
      }

      channel.ack(msg);
    }
  });
};
