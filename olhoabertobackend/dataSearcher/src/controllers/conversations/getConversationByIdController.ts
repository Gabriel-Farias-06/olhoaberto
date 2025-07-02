import { Users } from "@/infra/db";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ message: "Não autenticado." });
    return;
  }

  const user = await Users.findById(userId).populate({
    path: "conversations",
    populate: {
      path: "messages",
    },
  });

  if (!user) {
    res.status(404).json({ message: "Usuário não encontrado." });
    return;
  }

  const conversation = user.conversations.find(
    (conv) => conv._id === conversationId
  );

  if (!conversation) {
    res.status(404).json({ message: "Conversa não encontrada." });
    return;
  }

  res.status(200).json({ conversation });
};
