import { News } from "../db";
import { LLMHub } from "../llm";
import { Article, SearchNewsInput, SearchNewsOutput } from "../types";
import { logger } from "../utils";

async function* streamNews(
  _: unknown,
  { query }: SearchNewsInput
): AsyncGenerator<{ streamNews: SearchNewsOutput }> {
  logger(`Searching for: ${query}...`);

  const llmHub = new LLMHub();
  const queryVector = await llmHub.embedQuery(query);

  const news = await News.aggregate([
    {
      $vectorSearch: {
        index: process.env.VECTOR_INDEX!,
        path: "embedding",
        queryVector,
        numCandidates: 100, // Increased for better recall
        limit: 10,
      },
    },
  ]);

  logger(`Found: ${news.length} news`);

  const sources = news.map(({ title, url, date }) => ({
    title,
    url,
    date: new Date(Number(date)).toISOString(),
  }));

  const articles: Article[] = news.map(({ title, url, content, date }) => ({
    title,
    url,
    content,
    date,
  }));

  const stream = llmHub.stream(
    `Put the articles related to: "${query}". 
     together, Separated by title. If no articles are relevant, return "No relevant news found". 
     Articles: ${JSON.stringify(articles)}`
  );

  let answer = "";
  for await (const chunk of stream) {
    answer += chunk;
    yield {
      streamNews: {
        answer,
        sources,
      },
    };
  }
}

export default streamNews;
