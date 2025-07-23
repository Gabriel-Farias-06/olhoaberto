/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import {
  loginController,
  signUpController,
  updateInstructionsController,
  deleteUserController,
  updateUserController,
  addConversationController,
  deleteAllUserConversationsController,
  deleteOneConversationController,
  createAlertsController,
  deleteAlertController,
  logoutController,
  getAlertsController,
  getConversationsController,
  getAlertsByIdController,
  getInstructionsController,
  getConversationByIdController,
  getMeController,
  streamArticlesController,
} from "./controllers";
import { connectDb } from "./infra/db";
import alertConsumer from "./consumers/alertConsumer";
import path from "path";
import { authenticationMiddleware } from "./middleware";

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "dev"}`),
});

connectDb().then(async () => {
  const app = express();
  app.use(
    cors({
      origin: "*",
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  alertConsumer();

  app.get("/stream", authenticationMiddleware, streamArticlesController);

  app.post(
    "/conversations/:userId",
    authenticationMiddleware,
    addConversationController
  );

  app.post("/signup", signUpController);

  app.get("/me", authenticationMiddleware, getMeController);

  app.get(
    "/conversations",
    authenticationMiddleware,
    getConversationsController
  );

  app.get("/alerts", authenticationMiddleware, getAlertsController);

  app.get("/alerts/:id", authenticationMiddleware, getAlertsByIdController);

  app.post("/alert", authenticationMiddleware, createAlertsController);

  app.delete("/alerts/:id", authenticationMiddleware, deleteAlertController);

  app.get(
    "/conversations/:conversationId",
    authenticationMiddleware,
    getConversationByIdController
  );

  app.delete(
    "/conversations",
    authenticationMiddleware,
    deleteAllUserConversationsController
  );

  app.delete(
    "/conversations/:conversationId",
    authenticationMiddleware,
    deleteOneConversationController
  );

  app.post("/login", loginController);

  app.get("/logout", authenticationMiddleware, logoutController);

  app.put("/updateUser", authenticationMiddleware, updateUserController);

  app.post("/deleteUser", authenticationMiddleware, deleteUserController);

  app.get("/instructions", authenticationMiddleware, getInstructionsController);

  app.put("/instructions", authenticationMiddleware, (req, res) => {
    const { instructions } = req.body;
    updateInstructionsController(req.user?.email as string, instructions, res);
  });

  app.listen(4040, () => {
    console.info("Server is running on http://localhost:4040");
  });
});
