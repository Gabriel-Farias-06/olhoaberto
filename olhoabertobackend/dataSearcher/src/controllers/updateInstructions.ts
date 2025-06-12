import { IAConfig, Users } from "@/infra/db";
import { Response } from "express";

export default async (
  email: string,
  instructions: string,
  res: Response,
) => {
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role === "user")
      return res.status(401).json({ message: "Acess denied" });
    await IAConfig.findOneAndUpdate({}, { instructions }, { upsert: true });
    return res
      .status(200)
      .json({ message: "Instructions updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
