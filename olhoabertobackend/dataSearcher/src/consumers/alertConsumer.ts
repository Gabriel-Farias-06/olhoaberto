/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Articles, IAConfig, Notifications } from "@/infra/db";
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

      const alerts = await Alert.find({});
      const llmHub = new LLMHub();
      const config = await IAConfig.findOne();

      for (const alert of alerts) {
        const queryVector = await llmHub.embedQuery(alert.descricao);
        const articles = await Articles.aggregate([
          {
            $vectorSearch: {
              index: process.env.VECTOR_INDEX!,
              path: "embedding",
              queryVector,
              numCandidates: 100,
              limit: 20,
            },
          },
        ]);

        if (articles.length > 0) {
          const stream = llmHub.stream(
            `Resuma os artigos relacionados a estritamente a: "${alert.descricao}" com base nas limitações: "${config?.instructions}". Organize em Markdown. Se não houver resultado, retorne nada`
          );

          let response = "";
          for await (const chunk of stream) {
            response += chunk;
          }

          io.emit("alertResult", {
            userId: alert.user,
            descricao: alert.descricao,
            resultado: response,
          });

          await Notifications.create({
            alertaId: alert._id,
            conteudo: response,
            data: new Date(),
          });
        }
      }

      channel.ack(msg);
    }
  });
};
