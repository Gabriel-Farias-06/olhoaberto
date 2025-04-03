import dotenv from "dotenv";
import { connectDb } from "./db";
import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { schema } from "./schema.graphql";

dotenv.config();

connectDb().then(async () => {
  const yoga = createYoga({ schema });

  const server = createServer(yoga);

  server.listen(4000, () => {
    console.info("Server is running on http://localhost:4000/graphql");
  });
});
