import { Users } from "@/infra/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response, Request } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "chave";

export default async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user?.password as string
    );
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    await Users.updateOne({ _id: user._id }, { accessToken });

    res.status(200).json({
      accessToken,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
