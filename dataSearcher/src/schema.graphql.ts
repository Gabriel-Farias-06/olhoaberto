import { createSchema } from "graphql-yoga";
import { streamArticles } from "./services";

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      _empty: String
    }

    type Subscription {
      streamArticles(query: String!): StreamArticlesOutput
    }

    type StreamArticlesOutput {
      answer: String
      sources: [Source]
    }

    type Source {
      pdfPage: String
      path: String
      date: String
    }
  `,
  resolvers: {
    Subscription: {
      streamArticles: {
        subscribe: streamArticles,
      },
    },
  },
});
