import dotenv from "dotenv";
import express from "express";
import {
  loginController,
  streamArticles,
  updateInstructions,
} from "./controllers";
import { connectDb } from "./infra/db";

dotenv.config();

connectDb().then(async () => {
  const app = express();
  app.use(express.json());

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

  app.post("/cadastro", async (req, res) => {
    // const { email, password } = req.body;

    // const dados = loginController(email, password);
    res.json({});
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const dados = loginController(email, password);
    res.json(dados);
  });

  app.post("/armazenar-instrucoes", async (req, res) => {
    const { instrucoes } = req.body;

    const dados = updateInstructions(instrucoes);
    res.json(dados);
    res.status(204);
  });

  app.listen(4000, () => {
    console.info("Server is running on http://localhost:4000");
  });
});
