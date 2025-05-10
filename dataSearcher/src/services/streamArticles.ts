import { Articles } from "../db";
import { LLMHub } from "../llm";
import { SearchArticlesOutput } from "../types";
import { logger } from "../utils";

async function* streamArticles(
  query: string
): AsyncGenerator<{ streamArticles: SearchArticlesOutput }> {
  logger(`Searching for: ${query}...`);

  const llmHub = new LLMHub();
  const queryVector = await llmHub.embedQuery(query);

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

  logger(`Found: ${articles.length} articles`);

  const sources = articles.map(({ pdfPage, path, date }) => ({
    pdfPage,
    path,
    date,
  }));

  const stream = llmHub.stream(
    `Coloque os artigos relacionados a: "${query}". 
     juntos, separados por titulos em markdown. . Se não há artigos relevantes, returne "Não foram encontrados artigos relevantes". Não escreva nenhum enunciado. Organize por 
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
}

export default streamArticles;
