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

import "express-session";

declare module "express-session" {
  interface SessionData {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}
