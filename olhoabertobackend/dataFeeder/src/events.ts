import EventEmitter from "events";
import { Article } from "./types";
import { Articles } from "./db";
import { logger } from "./utils";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { LLM_CONFIG } from "./llm/config";
import { BROKER } from "./db/broker";

export const eventEmitter = new EventEmitter();

export async function saveOnDb(articles: Article[]) {
  for (const [i, { date, pdfPage, path, content }] of articles.entries()) {
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
        const article = new Articles({
          date,
          pdfPage,
          path,
          content,
          embedding,
        });
        await article.save();

        logger("emiting event");

        BROKER.hasNewArticle = true;

        logger(`${date} => ${path} => Artigo Salvo!`);
      }
    } catch (error) {
      logger((error as Error).message);
    }
    articles.splice(i, 1);
  }
}
