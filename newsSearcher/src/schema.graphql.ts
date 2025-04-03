import { createSchema } from "graphql-yoga";
import { searchNews, streamNews } from "./services";
import { setTimeout as setTimeout$ } from "node:timers/promises";

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      searchNews(query: String!): SearchNewsOutput
    }

    type Subscription {
      streamNews(query: String!): SearchNewsOutput
      countdown(from: Int!): Int!
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
      countdown: {
        // This will return the value on every 1 sec until it reaches 0
        subscribe: async function* (_, { from }) {
          for (let i = from; i >= 0; i--) {
            await setTimeout$(1000);
            yield { countdown: i };
          }
        },
      },
    },
  },
});
