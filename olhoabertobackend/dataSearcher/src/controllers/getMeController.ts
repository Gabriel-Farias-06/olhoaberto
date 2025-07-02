import { Users } from "@/infra/db";
import { logger } from "@/utils";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  try {
    console.log(req.user);

    const user = await Users.findById({ _id: req.user?._id }).lean();

    res.status(200).json({
      user,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    logger(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
