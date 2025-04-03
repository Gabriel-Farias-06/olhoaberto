import { News } from "../db";
import { generateEmbedding } from "../llm";
import { logger } from "../utils";

export type SaveToDatabaseInput = {
  title: string;
  content: string;
  url: string;
};

async function saveToDatabase({ title, content, url }: SaveToDatabaseInput) {
  logger(`Saving on db...`);
  const alreadySaved = (await News.find()).some(
    ({ url: savedUrl }) => savedUrl === url
  );
  if (!alreadySaved) {
    const embedding = await generateEmbedding(`${title}${content}`);
    const news = new News({
      title,
      content,
      url,
      date: new Date().toISOString(),
      embedding,
    });
    await news.save();
    logger(
      `-=-=-=-=-=-=-= News saved successfully: ${url} -=-=-=-=-=-=-= \n\n\n`
    );
  } else {
    logger(`-=-=-=-=-=-=-= News already saved: ${url} -=-=-=-=-=-=-= \n\n\n`);
  }
}

export default saveToDatabase;
