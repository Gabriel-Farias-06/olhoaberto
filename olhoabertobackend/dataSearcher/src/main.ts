// Importação de bibliotecas e módulos necessários
import dotenv from "dotenv";
import express from "express";
import session from "express-session";

// Importa os controladores e middlewares do projeto
import {
  loginController,
  signUpController,
  streamArticles,
  updateInstructions,
  authenticatedMiddlewareController,
  deleteUserController,
  updateUserController,
} from "./controllers";
// Importa função para conectar ao banco de dados
import { connectDb } from "./infra/db";

// Carrega as variáveis de ambiente
dotenv.config();

// Conecta ao banco de dados e inicia o servidor após a conexão
connectDb().then(async () => {
  const app = express();
  app.use(express.json()); // Permite o parsing de JSON no body das requisições

  // Configuração da sessão do usuário
  app.use(
    session({
      secret: process.env.SESSION_SECRET as string, // Chave secreta usada para assinar o cookie
      resave: false, // Não salva a sessão se ela não for modificada
      saveUninitialized: false, // Não cria sessões vazias
      cookie: {
        secure: false, // Define se o cookie será enviado apenas via HTTPS
        maxAge: 120 * 60 * 1000, // Duração do cookie (2 horas)
      },
    }),
  );

  // Middleware para configurar headers de CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Permite requisições desse domínio
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true"); // Permite envio de cookies
    next();
  });

  // Rota de streaming de artigos
  app.get("/stream", async (req, res) => {
    const query = req.query.q as string;
    const email = req.query.email as string | undefined;

    console.log({ query });

    // Define os headers para permitir resposta em streaming
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    try {
      // Faz o streaming dos dados enquanto eles são recebidos
      for await (const chunk of streamArticles(email, query)) {
        res.write(JSON.stringify(chunk.streamArticles) + "\n");
      }
      res.end(); // Finaliza a resposta
    } catch (err) {
      console.error(err);
      res.status(500).end("Error during streaming");
    }
  });

  // Rota de cadastro
  app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    signUpController(name, email, password, req, res);
  });

  // Rota de login
  app.post("/login", async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json("Email and password are obrigatories");
      return;
    }

    loginController(email, password, req, res);
  });

  // Rota de logout
  app.post("/logout", async (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logout sucessful" });
    });
  });

  // Rota para atualizar dados do usuário (requer autenticação)
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

  // Rota para deletar o usuário (requer autenticação)
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

  // Rota para atualizar instruções do usuário (requer autenticação)
  app.put(
    "/instructions",
    authenticatedMiddlewareController,
    async (req, res) => {
      const { instructions } = req.body;
      const { email } = req.session.user!; // Obtém email do usuário logado
      updateInstructions(email, instructions, res);
    },
  );

  // Inicia o servidor na porta 4000
  app.listen(4000, () => {
    console.info("Server is running on http://localhost:4000");
  });
});
