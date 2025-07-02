import { Users } from "@/infra/db";
import { Response, Request } from "express";
import bcrypt from "bcryptjs";

export default async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const regexpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexpEmail.test(email))
    res
      .status(406)
      .json({ message: "Email does not attend to the requirements" });
  const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!regexp.test(password))
    res
      .status(406)
      .json({ message: "Password does not attend to the requirements" });
  const sameUser = await Users.findOne({ email });
  if (sameUser) res.status(409).json({ message: "Email already taken" });
  const hashedPassword = await bcrypt.hash(password, 10);
  await Users.create({ name, email, password: hashedPassword });
  res.status(200).json({
    message: "User created successfully",
  });
};
