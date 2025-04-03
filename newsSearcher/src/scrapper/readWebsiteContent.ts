import { logger } from "../utils";
import openPage from "./openPlaywright";

async function readWebsiteContent(url: string): Promise<string> {
  logger(`Reading URL: ${url}`);

  const { page, browser } = await openPage(url);

  // Extract text content from specific tags and image alt descriptions
  const contentArray: string[] = await page.evaluate(() => {
    const textContent: string[] = [];

    // Select all relevant tags (div, span, h, p)
    const tags = document.querySelectorAll(
      "div, span, h1, h2, h3, h4, h5, h6, p"
    );
    tags.forEach((element) => {
      const text = element.textContent?.trim();
      if (text) textContent.push(text);
    });

    // Select all <img> tags and extract alt descriptions
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      const altText = (img as HTMLImageElement).alt.trim();
      if (altText) textContent.push(altText);
    });

    return textContent.filter(Boolean); // Filter out empty strings
  });

  const extractedText = contentArray.join(" | ");

  logger(`Extract text with ${extractedText.length} characters: ${url}`);

  await browser.close();

  return getFirstMillionCharacters(extractedText);
}

function getFirstMillionCharacters(str: string) {
  if (typeof str !== "string") {
    return ""; // Return empty string for non-string input.
  }

  if (str.length <= 1000000) {
    return str; // Return the entire string if it's shorter than 1 million characters.
  }

  return str.substring(0, 1000000); // Return the first 1 million characters.
}

export default readWebsiteContent;
