import { Articles } from "../db";
import { logger } from ".";

// remove urls that are already stored in the database
async function removeAlreadySavedArticles(
  newLinks: string[]
): Promise<string[]> {
  logger("Discriminating URLs...");

  const savedLinks =
    (
      await Articles.aggregate([
        {
          $group: {
            _id: null,
            links: { $push: "$link" }, // Collect all links into an array
          },
        },
        {
          $project: { _id: 0, links: 1 },
        }, // Remove _id from output
      ])
    )[0]?.links || [];

  const discriminatedUrls: string[] = newLinks.filter(
    (newLink) => !savedLinks.includes(newLink)
  );

  logger(
    `${
      discriminatedUrls.length > 0
        ? `Discriminated: ${discriminatedUrls}`
        : `All urls provided were already saved`
    }`
  );

  return discriminatedUrls;
}

export default removeAlreadySavedArticles;
