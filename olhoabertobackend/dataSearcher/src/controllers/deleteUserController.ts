import { Users } from "@/infra/db";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

export default async (req: Request, res: Response) => {
  const { password } = req.body;
  const { email } = req.session.user!;
  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user?.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  await Users.deleteOne({ email });
  req.session.destroy(() => {
    res.status(200).json({ message: "Account deleted sucessful" });
  });
};