/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface JwtUserPayload {
  _id: string;
  name: string;
  email: string;
  role: string;
}
