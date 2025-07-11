import { LLMHub } from "@/infra/llm";
import { SearchArticlesOutput } from "../types";
import { logger } from "../utils";
import { Articles, IAConfig, Users } from "@/infra/db";
import { Request, Response } from "express";
import mongoose from "mongoose";

export default async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const { q: query, email, idItem } = req.query;

  if (!query) {
    res.status(400).json({ message: "Query parameter 'q' is required." });
    return;
  }

  try {
    const streamEmail = typeof email === "string" ? email : undefined;
    const streamIdConversation =
      typeof idItem === "string" ? idItem : undefined;

    for await (const chunk of streamArticles(
      streamEmail,
      query as string,
      streamIdConversation
    )) {
      res.write(JSON.stringify(chunk) + "\n");
    }
    res.end();
  } catch (err) {
    console.error("Error during streaming:", err);
    res
      .status(500)
      .end(JSON.stringify({ message: "Error during article streaming." }));
  }
};

async function* streamArticles(
  email: string | undefined,
  query: string,
  idConversation: string | undefined
): AsyncGenerator<{ streamArticles: SearchArticlesOutput }> {
  logger(`Searching for: ${query}...`);
  console.log({ email, idConversation });

  const llmHub = new LLMHub();
  const queryVector = await llmHub.embedQuery(query);

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

  logger(`Found: ${articles.length} articles`);

  const sources = articles.map(({ pdfPage, path, date }) => ({
    pdfPage,
    path,
    date,
  }));

  const limitacions = await IAConfig.findOne();
  const stream = llmHub.stream(
    `Coloque os artigos relacionados a: "${query}" com as seguintes limitações: "${
      limitacions?.instructions
    }". 
     juntos, separados por titulos em markdown. . Se não há artigos relevantes, retorne "Não foram encontrados artigos relevantes". Não escreva nenhum enunciado. Organize por 
     Artigos: ${JSON.stringify(
       articles
     )}. Saniteze-os também, tirando as tags xml. Conserve todas as informações. Organize em Título, Conteúdo, Data e Documento PDF. `
  );

  let answer = "";

  for await (const chunk of stream) {
    answer += chunk;
    yield {
      streamArticles: {
        answer,
        sources,
      },
    };
  }

  if (email) {
    if (idConversation) {
      await Users.updateOne(
        {
          email,
          "conversations._id": new mongoose.Types.ObjectId(idConversation),
        },
        {
          $push: {
            "conversations.$.messages": {
              $each: [
                { content: query, role: "user" },
                { content: answer, role: "assistant" },
              ],
            },
          },
        }
      );
    } else {
      const newConversation = {
        _id: new mongoose.Types.ObjectId(),
        messages: [
          { content: query, role: "user" },
          { content: answer, role: "assistant" },
        ],
        createdAt: new Date(),
      };

      await Users.updateOne(
        { email },
        { $push: { conversations: newConversation } }
      );
      return newConversation._id;
    }
  }
}
