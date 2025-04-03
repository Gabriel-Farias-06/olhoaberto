import { logger } from "../utils";
import LLMHub from "./LLMHub";

async function extractNewsContent(
  content: string
): Promise<{ title: string; content: string } | void> {
  const stringContent = (
    await new LLMHub().invoke(
      `Extract the first news content and readline. Read only the content that is related to the readline. Then, return JSON on this format {title: string, content: string}: ${content}.`
    )
  ).content as unknown as string;

  const sanitizedResponse = removeFirstAndLastLine(stringContent);

  const json = JSON.parse(sanitizedResponse);

  logger(`Response: ${JSON.stringify(json)}`);

  if (!json?.title) {
    logger("Content not found");
    return;
  }
  if (!json?.content) {
    logger("Title not found");
    return;
  }

  return { content: json.content, title: json.title };
}

// removes ```json``` marks
function removeFirstAndLastLine(str: string) {
  logger("Sanitizing response...");
  const lines = str.split("\n");
  if (lines.length <= 2) return "";
  return lines.slice(1, -1).join("\n");
}

export default extractNewsContent;
