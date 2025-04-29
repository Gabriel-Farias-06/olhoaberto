export type SearchArticlesInput = {
  query: string;
};

export type Article = {
  date: string;
  pdfPage: string;
  content: string;
  path: string;
};

export type Source = Omit<Article, "content">;

export type SearchArticlesOutput = {
  answer: string;
  sources: Source[];
};
