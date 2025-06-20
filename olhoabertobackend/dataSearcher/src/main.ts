/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";

import { Alerts, IAConfig, Users } from "@/infra/db";

import {
  loginController,
  signUpController,
  streamArticles,
  updateInstructions,
  authenticatedMiddlewareController,
  deleteUserController,
  updateUserController,
  addConversation,
  deleteAllUserConversations,
  deleteOneConversation,
  createAlertsController,
  deleteAlertController,
} from "./controllers";
import { connectDb } from "./infra/db";
import alertConsumer from "./consumers/alertConsumer";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "dev"}`),
});

connectDb().then(async () => {
  const app = express();
  app.use(
    cors({
      origin: [process.env.DOMAIN ?? "", "http://localhost:3000"],
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

  alertConsumer();

  // app.get("/sse", (req, res) => {
  //   console.log("conectrado");

  //   res.setHeader("Content-Type", "text/event-stream");
  //   res.setHeader("Cache-Control", "no-cache");
  //   res.setHeader("Connection", "keep-alive");

  //   res.flushHeaders();

  //   clients.push(res);
  //   res.write(
  //     `event: newArticle` + `data: ${JSON.stringify({ response: "sdf" })}`
  //   );
  //   // Remove client ao desconectar
  //   req.on("close", () => {
  //     const idx = clients.indexOf(res);
  //     if (idx !== -1) clients.splice(idx, 1);
  //   });
  // });

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

  app.get("/me", async (req, res) => {
    console.log("Sessão no /me:", req.session.user);

    if (req.session?.user?.id) {
      res.status(200).json({
        message: "Authenticated",
        user: {
          _id: req.session.user.id,
          name: req.session.user.name,
          email: req.session.user.email,
          role: req.session.user.role,
          conversations: req.session.user.conversations,
        },
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  app.get(
    "/conversations",
    authenticatedMiddlewareController,
    async (req, res) => {
      const userId = req.session.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Não autenticado." });
        return;
      }

      const user = await Users.findById(userId).populate({
        path: "conversations",
        populate: { path: "messages" },
      });

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      res.status(200).json({ conversations: user.conversations });
      return;
    }
  );

  app.get("/alerts", authenticatedMiddlewareController, async (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Não autenticado." });
      return;
    }

    try {
      const alerts = await Alerts.find({ user: userId }).lean();

      res.status(200).json({ alerts });
    } catch (err) {
      console.error("Erro ao buscar alertas:", err);
      res.status(500).json({ message: "Erro ao buscar alertas." });
    }
  });

  app.get(
    "/alerts/:id",
    authenticatedMiddlewareController,
    async (req, res) => {
      const userId = req.session.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Não autenticado." });
      }

      const alertId = req.params.id;

      try {
        const alert = await Alerts.findOne({
          _id: alertId,
          user: userId,
        }).lean();

        if (!alert) {
          res.status(404).json({ message: "Alerta não encontrado." });
        }

        res.status(200).json({ alert });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar alerta." });
      }
    }
  );

  app.post("/alert", authenticatedMiddlewareController, createAlertsController);

  app.delete(
    "/alert/:id",
    authenticatedMiddlewareController,
    deleteAlertController
  );

  app.get(
    "/conversations/:conversationId",
    authenticatedMiddlewareController,
    async (req, res) => {
      const { conversationId } = req.params;
      const userId = req.session.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Não autenticado." });
        return;
      }

      const user = await Users.findById(userId).populate({
        path: "conversations",
        populate: {
          path: "messages",
        },
      });

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      const conversation = user.conversations.find(
        (conv) => conv._id === conversationId
      );

      if (!conversation) {
        res.status(404).json({ message: "Conversa não encontrada." });
        return;
      }

      res.status(200).json({ conversation });
    }
  );

  app.delete(
    "/conversations",
    authenticatedMiddlewareController,
    deleteAllUserConversations
  );

  app.delete(
    "/conversations/:conversationId",
    authenticatedMiddlewareController,
    deleteOneConversation
  );

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

  app.get(
    "/instructions",
    authenticatedMiddlewareController,
    async (req, res) => {
      const user = req.session.user;

      if (!user || user.role !== "admin") {
        res.status(403).json({ message: "Acesso negado." });
      }

      try {
        const config = await IAConfig.findOne();
        res.status(200).json({ instructions: config?.instructions || "" });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Erro ao buscar configurações." });
      }
    }
  );

  app.put("/instructions", authenticatedMiddlewareController, (req, res) => {
    const { instructions } = req.body;
    if (!req.session?.user?.email) {
      res.status(401).json({ message: "User not authenticated." });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { email } = req.session.user as unknown as any;
    updateInstructions(email, instructions, res);
  });

  app.listen(4040, () => {
    console.info("Server is running on http://localhost:4040");
  });
});
