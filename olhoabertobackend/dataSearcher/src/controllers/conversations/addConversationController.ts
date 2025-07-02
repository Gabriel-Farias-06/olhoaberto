import { Users } from "@/infra/db";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) res.status(400).json({ message: "The userId is required" });

    const user = await Users.findById(userId);
    if (!user) res.status(404).json({ message: "User not found" });

    const newConversation = { messages: [], startedAt: new Date() };

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        $push: {
          conversations: newConversation,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      res.status(500).json({ message: "Failed to update user" });
      return;
    }

    const createdConversation =
      updatedUser.conversations[updatedUser.conversations.length - 1];

    res.status(201).json({ conversation: createdConversation });
  } catch (err) {
    console.error("Erro ao adicionar conversa:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
