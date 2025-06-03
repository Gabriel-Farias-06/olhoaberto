import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";

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

connectDb().then(() => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production", // Set secure to true in production
        maxAge: 120 * 60 * 1000, // 2 hours
      },
    })
  );

  app.get("/stream", async (req, res) => {
    const { q: query, email, idConversation } = req.query;

    if (!query) {
      res.status(400).json({ message: "Query parameter 'q' is required." });
    }

    console.log("Stream request received:", { query, email, idConversation });

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const streamEmail = typeof email === "string" ? email : undefined;
      const streamIdConversation =
        typeof idConversation === "string" ? idConversation : undefined;

      for await (const chunk of streamArticles(
        streamEmail,
        query as string,
        streamIdConversation
      )) {
        res.write(JSON.stringify(chunk) + "\n");
      }
      res.end();
    } catch (err) {
      console.error("Error during streaming:", err);
      res
        .status(500)
        .end(JSON.stringify({ message: "Error during article streaming." }));
    }
  });

  app.post(
    "/conversations/:userId",
    authenticatedMiddlewareController,
    (req, res) => {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ message: "The userId is required" });
      }
      addConversation(req, res, userId);
    }
  );

  app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    signUpController(name, email, password, req, res);
  });

  app.get("/me", (req, res) => {
    console.info("Cookies recebidos:", req.headers.cookie);
    console.info("Sessão:", req.session);

    if (req.session?.user?.id) {
      res.status(200).json({
        message: "Authenticated",
        user: {
          id: req.session.user.id,
          name: req.session.user.name,
          email: req.session.user.email,
        },
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
    }
    loginController(email, password, req, res);
  });

  app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).json({ message: "Failed to logout." });
      }
      res.status(200).json({ message: "Logout successful" });
    });
  });

  app.put("/updateUser", authenticatedMiddlewareController, (req, res) => {
    const { actualPassword, newPassword, newName } = req.body;

    if (!actualPassword || (!newPassword && !newName)) {
      res
        .status(400)
        .json({ message: "Current password and new information are required" });
    }
    updateUserController(req, res);
  });

  app.delete("/deleteUser", authenticatedMiddlewareController, (req, res) => {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ message: "Password is required" });
    }
    deleteUserController(req, res);
  });

  app.put("/instructions", authenticatedMiddlewareController, (req, res) => {
    const { instructions } = req.body;
    if (!req.session?.user?.email) {
      res.status(401).json({ message: "User not authenticated." });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { email } = req.session.user as unknown as any;
    updateInstructions(email, instructions, res);
  });

  app.listen(4000, () => {
    console.info("Server is running on http://localhost:4000");
  });
});
