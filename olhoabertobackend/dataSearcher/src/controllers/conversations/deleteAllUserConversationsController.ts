import { Users } from "@/infra/db";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ message: "Não autenticado." });
  }

  try {
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { $set: { conversations: [] } },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "Usuário não encontrado." });
    }

    res
      .status(200)
      .json({ message: "Todas as conversas foram deletadas com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar todas as conversas:", err);
    res.status(500).json({ message: "Erro interno ao deletar as conversas." });
  }
};
