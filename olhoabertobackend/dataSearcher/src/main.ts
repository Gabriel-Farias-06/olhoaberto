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

  const router = express.Router();
  router.get("/stream", authenticationMiddleware, streamArticlesController);
  router.post(
    "/conversations/:userId",
    authenticationMiddleware,
    addConversationController
  );
  router.post("/signup", signUpController);
  router.get("/me", authenticationMiddleware, getMeController);
  router.get(
    "/conversations",
    authenticationMiddleware,
    getConversationsController
  );
  router.get("/alerts", authenticationMiddleware, getAlertsController);
  router.get("/alerts/:id", authenticationMiddleware, getAlertsByIdController);
  router.post("/alert", authenticationMiddleware, createAlertsController);
  router.delete("/alerts/:id", authenticationMiddleware, deleteAlertController);
  router.get(
    "/conversations/:conversationId",
    authenticationMiddleware,
    getConversationByIdController
  );
  router.delete(
    "/conversations",
    authenticationMiddleware,
    deleteAllUserConversationsController
  );
  router.delete(
    "/conversations/:conversationId",
    authenticationMiddleware,
    deleteOneConversationController
  );
  router.post("/login", loginController);
  router.get("/logout", authenticationMiddleware, logoutController);
  router.put("/updateUser", authenticationMiddleware, updateUserController);
  router.post("/deleteUser", authenticationMiddleware, deleteUserController);
  router.get(
    "/instructions",
    authenticationMiddleware,
    getInstructionsController
  );
  router.put("/instructions", authenticationMiddleware, (req, res) => {
    const { instructions } = req.body;
    updateInstructionsController(req.user?.email as string, instructions, res);
  });

  app.use("/api", router);

  app.listen(4040, () => {
    console.info("Server is running on http://localhost:4040");
  });
});
