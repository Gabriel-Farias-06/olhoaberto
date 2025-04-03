import { News } from "../db";
import { extractNewsContent, generateEmbedding } from "../llm";
import { readWebsiteContent } from "../scrapper";
import { removeAlreadySavedNews, logger } from "../utils";

async function saveUrls(urls: string[]) {
  const discriminatedUrls = await removeAlreadySavedNews(urls);

  discriminatedUrls.forEach(async (url: string) => {
    const text = await readWebsiteContent(url);

    const res = await extractNewsContent(text);
    if (res?.title && res?.content) {
      const { title, content } = res;
      logger(`Saving on db...`);
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
    }
  });
}

export default saveUrls;
