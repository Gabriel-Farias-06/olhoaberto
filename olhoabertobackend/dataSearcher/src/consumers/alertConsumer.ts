/* eslint-disable @typescript-eslint/no-explicit-any */
import { clients } from "@/clients";
import { Alerts, Articles, IAConfig } from "@/infra/db";
import { LLMHub } from "@/infra/llm";
import { logger } from "@/utils";
import amqplib from "amqplib";

export default async () => {
  const conn = await amqplib.connect(process.env.RBTMQ_BROKER ?? "");
  const channel = await conn.createChannel();
  await channel.assertQueue("newArticles", { durable: true });

  logger("Waiting for messages in newArticles queue");

  channel.consume("newArticles", async (msg: any) => {
    if (msg) {
      logger("Received newArticles event");

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
          const stream = llmHub.stream(`Coloque os artigos relacionados a: "${
            alert.title
          }" "${alert.description}". Com base nestas instruções: ${
            config?.instructions
          }
           juntos, separados por titulos em markdown. . Se não há artigos relevantes, retorne "Não foram encontrados artigos relevantes". Não escreva nenhum enunciado. Organize por 
           Artigos: ${JSON.stringify(
             articles
           )}. Saniteze-os também, tirando as tags xml. Conserve todas as informações. Organize em Título, Conteúdo, Data e Documento PDF. `);

          let response = "";
          for await (const chunk of stream) {
            response += chunk;
          }
          if (response === "Não foram encontrados artigos relevantes")
            clients.forEach((client) => {
              client.write(
                `event: newArticle` + `data: ${JSON.stringify(response)}`
              );
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
