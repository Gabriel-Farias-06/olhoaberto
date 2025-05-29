// Importação de bibliotecas e módulos necessários
import dotenv from "dotenv";
import express from "express";
import session from "express-session";

// Importação de controladores e função de conexão com o banco de dados
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

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Conecta ao banco de dados e inicia o servidor após a conexão ser estabelecida
connectDb().then(async () => {
  const app = express();

  // Middleware para interpretar requisições JSON
  app.use(express.json());

  // Configuração da sessão (usada para autenticação e persistência de login)
  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // deve ser true em produção com HTTPS
        maxAge: 120 * 60 * 1000, // duração de 2 horas
      },
    }),
  );

  // Middleware para permitir CORS (Cross-Origin Resource Sharing)
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

  // Rota GET para streaming de artigos com base na query do usuário
  app.get("/stream", async (req, res) => {
    const query = req.query.q as string;
    const email = req.query.email as string | undefined;

    console.log({ query });

    // Configurações de cabeçalho para streaming
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    try {
      // Envia dados aos poucos enquanto são processados
      for await (const chunk of streamArticles(email, query)) {
        res.write(JSON.stringify(chunk.streamArticles) + "\n");
      }
      res.end();
    } catch (err) {
      console.error(err);
      res.status(500).end("Error during streaming");
    }
  });

  // Rota POST para cadastro de novos usuários
  app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    signUpController(name, email, password, req, res);
  });

  // Rota POST para login
  app.post("/login", async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json("Email and password are obrigatories");
      return;
    }

    loginController(email, password, req, res);
  });

  // Rota POST para logout (encerra a sessão)
  app.post("/logout", async (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logout sucessful" });
    });
  });

  // Rota PUT para atualização de nome de usuário (requer autenticação)
  app.put(
    "/updateUser",
    authenticatedMiddlewareController,
    async (req, res) => {
      const { password, newName } = req.body || {};
      if (!password || !newName) {
        res.status(400).json({ message: "Password and new name are required" });
        return;
      }
      updateUserController(req, res);
    },
  );

  // Rota DELETE para exclusão de usuário (requer autenticação)
  app.delete(
    "/deleteUser",
    authenticatedMiddlewareController,
    async (req, res) => {
      const { password } = req.body || {};
      if (!password) {
        res.status(400).json({ message: "Password is required" });
        return;
      }

      deleteUserController(req, res);
    },
  );

  // Rota PUT para atualizar instruções personalizadas do usuário (requer autenticação)
  app.put(
    "/instructions",
    authenticatedMiddlewareController,
    async (req, res) => {
      const { instructions } = req.body;
      const { email } = req.session.user!;
      updateInstructions(email, instructions, res);
    },
  );

  // Inicia o servidor na porta 4000
  app.listen(4000, () => {
    console.info("Server is running on http://localhost:4000");
  });
});
