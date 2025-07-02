/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JWT_SECRET } from "@/constants";
import { Users } from "@/infra/db";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authenticated" });
  }

  const accessToken = (authHeader as string).split(" ")[1];

  try {
    const user = await Users.findOne({ accessToken });
    if (!user) res.status(401).json({ message: "Invalid or expired token" });

    const decoded = jwt.verify(accessToken, JWT_SECRET);

    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
