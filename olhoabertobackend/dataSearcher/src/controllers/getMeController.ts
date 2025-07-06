/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Users } from "@/infra/db";
import { logger } from "@/utils";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  try {
    const { password, ...user } = await Users.findById({
      _id: req.user?._id,
    }).lean<any>();

    res.status(200).json({
      user,
    });
  } catch (err) {
    logger(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
