import { createSchema } from "graphql-yoga";
import { searchNews, streamNews } from "./services";

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      searchNews(query: String!): SearchNewsOutput
    }

    type Subscription {
      streamNews(query: String!): SearchNewsOutput
    }

    type SearchNewsOutput {
      answer: String
      sources: [Source]
    }

    type Source {
      title: String
      url: String
      date: String
    }
  `,
  resolvers: {
    Query: {
      searchNews,
    },
    Subscription: {
      streamNews: {
        subscribe: streamNews,
      },
    },
  },
});
