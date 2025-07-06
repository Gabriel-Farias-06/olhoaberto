import { Users } from "@/infra/db";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { conversationId } = req.params;
  console.log({ userId });

  if (!userId) {
    res.status(401).json({ message: "Não autenticado." });
    return;
  }

  try {
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        $pull: { conversations: { _id: conversationId } },
      },
      { new: true }
    );

    if (!updatedUser) {
      res
        .status(400)
        .json({ message: "Usuário não encontrado ou conversa não existe." });
      return;
    }

    res.status(200).json({ message: "Conversa deletada com sucesso." });
    return;
  } catch (err) {
    console.error("Erro ao deletar conversa:", err);
    res.status(500).json({ message: "Erro interno ao deletar a conversa." });
    return;
  }
};
