import { Users } from "@/infra/db";
import { Response, Request } from "express";
import bcrypt from "bcryptjs";

export default async (
  name: string,
  email: string,
  password: string,
  req: Request,
  res: Response,
) => {
  const regexpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexpEmail.test(email))
    return res
      .status(406)
      .json({ message: "Email does not attend to the requirements" });
  const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!regexp.test(password))
    return res
      .status(406)
      .json({ message: "Password does not attend to the requirements" });
  const sameUser = await Users.findOne({ email });
  if (sameUser) return res.status(409).json({ message: "Email already taken" });
  const hashedPassword = await bcrypt.hash(password, 10);
  await Users.create({ name, email, password: hashedPassword });
  return res.status(200).json({
    message: "User created successfully",
  });
};
