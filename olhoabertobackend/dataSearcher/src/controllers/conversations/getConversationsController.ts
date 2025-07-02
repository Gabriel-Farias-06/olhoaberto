import { Users } from "@/infra/db";
import { Request, Response } from "express";

export default async function getConversationsController(
  req: Request,
  res: Response
) {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ message: "Não autenticado." });
    return;
  }

  const user = await Users.findById(userId)
    .populate({
      path: "conversations",
      populate: { path: "messages" },
    })
    .lean();

  if (!user) res.status(404).json({ message: "Usuário não encontrado." });

  res.status(200).json({ conversations: user?.conversations });
}
