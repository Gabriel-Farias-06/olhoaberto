import openPlaywright from "./openPlaywright";

async function scrapeGoogleNewsLinks(searchQuery: string): Promise<string[]> {
  console.log(`Searching for: ${searchQuery}`);

  const { page, browser } = await openPlaywright(
    `https://www.google.com/search?q=${searchQuery}+news&sca_esv=7bada7996407e364&tbm=nws&sxsrf=AHTn8zp-6d9W-zNMLuFTbN-4-tQQmBF8jw:1743254543468&ei=D_TnZ-GkHPSi1sQPyPi_iQw&start=10&sa=N&ved=2ahUKEwih6MOesa-MAxV0kZUCHUj8L8EQ8tMDegQIBBAE&biw=1920&bih=493&dpr=1`
  );

  // Extract news article links from Google search results
  const articleLinks = await page
    .locator("div[data-news-cluster-id] a")
    .evaluateAll((links) =>
      links.map((link: unknown) => (link as HTMLAnchorElement).href)
    );

  console.log(
    articleLinks.length > 0
      ? `${articleLinks.length} found`
      : "No articles found"
  );

  await browser.close();

  return articleLinks;
}

export default scrapeGoogleNewsLinks;
