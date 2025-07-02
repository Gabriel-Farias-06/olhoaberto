import { Users } from "@/infra/db";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

export default async (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) res.status(400).json({ message: "Password is required" });

  const { email } = req.user!;

  const user = await Users.findOne({ email });
  if (!user) res.status(400).json({ message: "User not found" });

  const passwordMatch = await bcrypt.compare(
    password,
    user?.password as string
  );
  if (!passwordMatch) res.status(401).json({ message: "Invalid credentials" });

  await Users.deleteOne({ email });
};
