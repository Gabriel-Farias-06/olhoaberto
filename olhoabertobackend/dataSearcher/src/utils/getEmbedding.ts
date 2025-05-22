import * as use from "@tensorflow-models/universal-sentence-encoder";

let model: use.UniversalSentenceEncoder | null = null;

async function getEmbedding(text: string): Promise<number[]> {
  if (!model) {
    model = await use.load();
  }
  const embeddings = await model.embed([text]);
  return Array.from(embeddings.dataSync());
}

export default getEmbedding;
