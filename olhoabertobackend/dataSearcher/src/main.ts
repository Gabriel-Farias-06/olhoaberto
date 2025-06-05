import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";

import Users from "./infra/db/users.model";

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

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  app.use(express.json());
  app.use(cookieParser());

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

  app.post("/conversations/:userId",
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

  app.get('/me', async (req, res) => {
    console.log('Sessão no /me:', req.session.user);

    if (req.session?.user?.id) {
      res.status(200).json({
        message: 'Autenticado',
        user: {
          _id: req.session.user.id,
          name: req.session.user.name,
          email: req.session.user.email,
          role: req.session.user.role,
          conversations: req.session.user.conversations
        }
      });
    } else {
      res.status(401).json({ message: 'Não autenticado' });
    }
  });


  app.get("/conversations", authenticatedMiddlewareController, async (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Não autenticado." });
      return;
    }

    const user = await Users.findById(userId).populate({
      path: "conversations",
      populate: { path: "messages" }
    });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    res.status(200).json({ conversations: user.conversations });
    return;
  });


  app.get("/conversations/:conversationId", authenticatedMiddlewareController, async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.session.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Não autenticado." });
      return; // para aqui!
    }

    const user = await Users.findById(userId).populate({
      path: "conversations",
      populate: {
        path: "messages",
      },
    });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return; // para aqui!
    }

    const conversation = user.conversations.find(
      (conv) => conv._id === conversationId
    );

    if (!conversation) {
      res.status(404).json({ message: "Conversa não encontrada." });
      return; // para aqui!
    }

    // Se chegou aqui, tudo ok
    res.status(200).json({ conversation });
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
