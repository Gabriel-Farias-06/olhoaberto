import { Users } from "@/infra/db";
import { Response, Request } from "express";

export default async (req: Request, res: Response) => {
  try {
    await Users.updateOne({ _id: req.user?._id }, { accessToken: null });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
