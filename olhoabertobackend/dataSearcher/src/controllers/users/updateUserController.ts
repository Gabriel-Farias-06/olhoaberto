import { Users } from "@/infra/db";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const email = req.user!.email;

  const { actualPassword, newName, newPassword } = req.body;

  if (!actualPassword || (!newPassword && !newName)) {
    res
      .status(400)
      .json({ message: "Current password and new information are required" });
  }

  const user = await Users.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(
    actualPassword,
    user?.password as string
  );

  if (!passwordMatch) {
    res.status(401).json({ message: "Invalid credentials" });
  }

  await Users.updateOne(
    { email },
    {
      ...(newName && { name: newName }),
      ...(newPassword && { password: await bcrypt.hash(newPassword, 10) }),
    }
  );

  res.status(200).json({ message: "User updated successfully" });
};
