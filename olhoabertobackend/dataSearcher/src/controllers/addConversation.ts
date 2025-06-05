import { Users } from "@/infra/db";
import { Request, Response } from "express";

export default async (req: Request, res: Response, id: string) => {
  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newConversation = { messages: [], startedAt: new Date() };

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      {
        $push: {
          conversations: newConversation,
        },
      },
      { new: true }
    );

    if (!updatedUser) return res.status(500).json({ message: "Failed to update user" });

    const createdConversation = updatedUser.conversations[updatedUser.conversations.length - 1];

    return res.status(201).json({ conversation: createdConversation });
  } catch (err) {
    console.error("Erro ao adicionar conversa:", err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};
