import { LLMHub } from "@/infra/llm";
import { SearchArticlesOutput } from "../types";
import { logger } from "../utils";
import { Articles, IAConfig, Users } from "@/infra/db";

async function* streamArticles(
  email: string | undefined,
  query: string,
  idConversation: string | undefined
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
        limit: 5,
      },
    },
  ]);

  logger(`Found: ${articles.length} articles`);

  const sources = articles.map(({ pdfPage, path, date }) => ({
    pdfPage,
    path,
    date,
  }));
  console.log({ articles });

  // const config = (await Articles.find({}))[0];

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
    console.log({ answer });
    yield {
      streamArticles: {
        answer,
        sources,
      },
    };
  }

  if (email !== undefined && idConversation !== undefined)
    await Users.updateOne(
      { email, "conversations._id": idConversation },
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
}

export default streamArticles;
