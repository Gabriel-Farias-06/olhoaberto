import dotenv from "dotenv";
import express from "express";
import session from "express-session";

import {
  loginController,
  signUpController,
  streamArticles,
  updateInstructions,
  authenticatedMiddlewareController,
  deleteUserController,
  updateUserController,
  addConversation,
} from "./controllers";
import { connectDb } from "./infra/db";

dotenv.config();

connectDb().then(async () => {
  const app = express();
  app.use(express.json());

  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 120 * 60 * 1000,
      },
    }),
  );

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  app.get("/stream", async (req, res) => {
    const query = req.query.q as string;
    const email = req.query.email as string | undefined;
    const idConversation = req.query.idConversation as string | undefined;

    console.log(query);
    console.log(email);
    console.log(idConversation);

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    try {
      for await (const chunk of streamArticles(email, query, idConversation)) {
        res.write(JSON.stringify(chunk.streamArticles) + "\n");
      }
      res.end();
    } catch (err) {
      console.error(err);
      res.status(500).end("Error during streaming");
    }
  });

  app.post(
    "/conversations/:userId",
    authenticatedMiddlewareController,
    (req, res) => {
      const { userId } = req.params || {};
      if (!userId) {
        res.status(400).json({ message: "The userId is required" });
      }
      addConversation(req, res, userId);
    },
  );

  app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    signUpController(name, email, password, req, res);
  });

  app.post("/login", (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json("Email and password are obrigatories");
      return;
    }

    loginController(email, password, req, res);
  });

  app.post("/logout", (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logout sucessful" });
    });
  });

  app.put("/updateUser", authenticatedMiddlewareController, (req, res) => {
    const { actualPassword } = req.body || {};
    const { newPassword } = req.body || {};
    const { newName } = req.body || {};

    if (!actualPassword || (!newPassword && !newName)) {
      res
        .status(400)
        .json({ message: "Password and new informations are required" });
      return;
    }
    updateUserController(req, res);
  });

  app.delete("/deleteUser", authenticatedMiddlewareController, (req, res) => {
    const { password } = req.body || {};
    if (!password) {
      res.status(400).json({ message: "Password is required" });
      return;
    }

    deleteUserController(req, res);
  });

  app.put("/instructions", authenticatedMiddlewareController, (req, res) => {
    const { instructions } = req.body;
    const { email } = req.session.user!;
    updateInstructions(email, instructions, res);
  });

  app.listen(4000, () => {
    console.info("Server is running on http://localhost:4000");
  });
});
