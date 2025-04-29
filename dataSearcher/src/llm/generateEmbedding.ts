import { logger } from "../utils";
import LLMHub from "./LLMHub";

async function generateEmbedding(content: string) {
  logger("Generating embedding...");
  const vector = new LLMHub().embedQuery(content);
  return vector;
}

export default generateEmbedding;
