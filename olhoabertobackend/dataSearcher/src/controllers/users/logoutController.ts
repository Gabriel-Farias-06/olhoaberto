import { Users } from "@/infra/db";
import { logger } from "@/utils";
import { Response, Request } from "express";

export default async (req: Request, res: Response) => {
  try {
    logger("Logout request");
    console.log(req.user);

    await Users.updateOne({ _id: req.user?._id }, { accessToken: null });
    // res.status(204);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
