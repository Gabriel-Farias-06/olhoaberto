import { Users } from "@/infra/db";
import { Request, Response } from "express";

export default async (req: Request, res: Response, id: string) => {
  const user = await Users.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const updatedUser = await Users.findByIdAndUpdate(
    id,
    {
      $push: {
        conversations: {
          messages: [],
        },
      },
    },
    { new: true },
  );

  return res.status(201).json(updatedUser);
};
