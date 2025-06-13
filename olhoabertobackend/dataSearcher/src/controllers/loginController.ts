import { Users } from "@/infra/db";
import bcrypt from "bcryptjs";
import { Response, Request } from "express";

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
    console.log({ user });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.session.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      conversations: user.conversations || [],
    };

    return res.status(200).json({ conversations: user.conversations });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
