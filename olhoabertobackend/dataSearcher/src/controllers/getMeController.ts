import { JWT_SECRET } from "@/constants";
import { Users } from "@/infra/db";
import { JwtUserPayload } from "@/types";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authenticated" });
  }

  const token = (authHeader as string).split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload;

    const user = await Users.findById(decoded._id).lean();

    res.status(200).json({
      message: "Authenticated",
      user,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
