import dotenv from "dotenv";
import { connectDb } from "./db";
import express from "express";
import { streamArticles } from "./services";

dotenv.config();

connectDb().then(async () => {
  const app = express();

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

  app.get("/stream", async (req, res) => {
    const query = req.query.q as string;
    console.log({ query });

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Cache-Control", "no-cache");

    try {
      for await (const chunk of streamArticles(query)) {
        res.write(JSON.stringify(chunk.streamArticles) + "\n");
      }
      res.end();
    } catch (err) {
      console.error(err);
      res.status(500).end("Error during streaming");
    }
  });

  app.listen(4000, () => {
    console.info("Server is running on http://localhost:4000");
  });
});
