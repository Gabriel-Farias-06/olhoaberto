import { Users } from "@/infra/db";
import bcrypt from "bcryptjs";
import { Response } from "express";
import jwt from "jsonwebtoken";

export default async (email: string, password: string, res: Response) => {
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        conversations: user.conversations,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" },
    );

    return res.status(200).json({ token });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
