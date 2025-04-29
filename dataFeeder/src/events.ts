import EventEmitter from "events";
import { Article } from "./types";
import { Articles, connectDb } from "./db";
import { logger } from "./utils";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { LLM_CONFIG } from "./llm/config";

export const eventEmitter = new EventEmitter();

const queue: Article[] = [];

connectDb().then(async () => {
  eventEmitter.on("saveArticle", async (articles) => {
    queue.push(...articles);

    for (const [i, { date, pdfPage, path, content }] of queue.entries()) {
      try {
        const articleAlreadySaved = await Articles.findOne({ path });
        if (articleAlreadySaved)
          logger(`${date} => Artigo ${path} já está salvo!`);
        else {
          logger(`${date} => Gerando embedding para ${path}`);
          const embedding = await new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GEMINI_API_KEY,
            modelName: LLM_CONFIG.embeddingModel,
          }).embedQuery(`${date} ${pdfPage} ${content}`);

          logger(`${date} => Salvando artigo: ${path}...`);
          const articles = new Articles({
            date,
            pdfPage,
            path,
            content,
            embedding,
          });
          await articles.save();
          logger(`${date} => ${path} => Artigo Salvo!`);
        }
      } catch (error) {
        logger((error as Error).message);
      }
      queue.splice(i, 1);
    }
  });
});
