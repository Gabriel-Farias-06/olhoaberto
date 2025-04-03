export type SearchNewsInput = {
  query: string;
};

export type Article = {
  title: string;
  content: string;
  url: string;
  date: string;
};

export type Source = Omit<Article, "content">;

export type SearchNewsOutput = {
  answer: string;
  sources: Source[];
};
