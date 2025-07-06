import { Users } from "@/infra/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response, Request } from "express";

// Idealmente, armazene isso em um .env seguro
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // use uma chave forte

export default async (
  email: string,
  password: string,
  req: Request,
  res: Response
) => {
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1d", // ou o tempo que fizer sentido para você
    });
    console.log({ token });

    return res.status(200).json({
      token,
      user: payload,
      conversations: user.conversations || [],
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
