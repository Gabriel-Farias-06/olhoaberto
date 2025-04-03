import { extractNewsContent } from "../llm";
import { readWebsiteContent } from "../scrapper";
import { SearchNewsOutput } from "../types";
import { extractUrl } from "../utils";
import saveToDatabase from "./saveNews";

async function handleUrlQueryByUser(
  query: string
): Promise<null | SearchNewsOutput> {
  const url = extractUrl(query);
  if (url) {
    const content = await readWebsiteContent(url);
    const sanitizedContent = await extractNewsContent(content);
    if (sanitizedContent?.title && sanitizedContent?.content) {
      const { title, content } = sanitizedContent;
      saveToDatabase({ title, content, url });

      return {
        answer: content,
        sources: [{ title, url, date: new Date().toISOString() }],
      };
    } else {
      return {
        answer: "No Relevant Content Found",
        sources: [],
      };
    }
  }
  return null;
}

export default handleUrlQueryByUser;
