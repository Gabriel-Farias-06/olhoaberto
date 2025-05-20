import { Users } from "@/infra/db";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const email = req.session.user!.email;
  const { password, newName, newPassword } = req.body;

  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  await Users.updateOne(
    { email },
    {
      ...(newName && { name: newName }),
      ...(newPassword && { password: await bcrypt.hash(newPassword, 10) }),
    },
  );

  return res.status(200).json({ message: "User updated successfully" });
};
