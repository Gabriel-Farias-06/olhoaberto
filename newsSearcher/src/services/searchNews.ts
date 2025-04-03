import { News } from "../db";
import { LLMHub, summarizeArticles } from "../llm";
import { Article, SearchNewsInput, SearchNewsOutput } from "../types";
import { logger } from "../utils";
import handleUrlQueryByUser from "./handleUrlQueryByUser";

async function searchNews(
  _: unknown,
  { query }: SearchNewsInput
): Promise<SearchNewsOutput> {
  logger(`Searching for: ${query}...`);

  const res = await handleUrlQueryByUser(query);
  if (res) return res;

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

  const sources = [];
  const articles: Article[] = [];
  for (const { title, content, url, date } of news) {
    sources.push({
      title,
      url,
      date: new Date(Number(date)).toISOString(),
    });
    articles.push({ title, url, content, date });
  }

  const answer = await summarizeArticles({ query, articles });

  return {
    answer,
    sources,
  };
}

export default searchNews;
