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

  app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
      sameSite: "lax"
    }
  }));

  app.get("/stream", async (req, res) => {
    const query = req.query.q as string;
    const email = req.query.email as string | undefined;

    console.log({ query });

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    try {
      for await (const chunk of streamArticles(email, query)) {
        res.write(JSON.stringify(chunk.streamArticles) + "\n");
      }
      res.end();
    } catch (err) {
      console.error(err);
      res.status(500).end("Error during streaming");
    }
  });

  app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    signUpController(name, email, password, req, res);
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    await loginController(email, password, req, res);
  });

  app.post('/logout', async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao fazer logout' })
      }
      res.clearCookie('connect.sid')
      res.status(200).json({ message: 'Logout sucessful' })
    })
  })

  /* COMENTEI PQ ESTAVA DANDO ERRO
  app.put('/updateUser', authenticatedMiddlewareController, async (req, res) => {
    updateUserController(req, res);
  })
  
  app.delete('/deleteUser', authenticatedMiddlewareController, async (req, res) => {
    deleteUserController(req, res);
  })
  

  app.put("/instructions", authenticatedMiddlewareController, async (req, res) => {
    const { instructions } = req.body;
    const { email } = req.session.user;
    updateInstructions(email, instructions, res);
  });
*/

  app.get('/me', async (req, res) => {
    console.info('Cookies recebidos:', req.headers.cookie)
    console.info('Sessão:', req.session);

    if (req.session?.user?.id) {
      res.status(200).json({
        message: 'Autenticado',
        user: {
          id: req.session.user.id,
          name: req.session.user.name,
          email: req.session.user.email
        }
      });
    } else {
      res.status(401).json({ message: 'Não autenticado' });
    }
  });

  app.listen(4000, () => {
    console.info("Server is running on http://localhost:4000");
  });
});
