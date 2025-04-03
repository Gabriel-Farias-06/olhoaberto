import { Article } from "../types";
import LLMHub from "./LLMHub";

type SummarizeArticlesInput = {
  query: string;
  articles: Article[];
};

async function summarizeArticles({ query, articles }: SummarizeArticlesInput) {
  return (
    await new LLMHub().invoke(
      `Summarize only the most relevant articles related to: "${query}". Separate summaries by title. If no articles are relevant, return "No relevant news found". Articles: ${JSON.stringify(
        articles
      )}`
    )
  ).content as string;
}

export default summarizeArticles;
