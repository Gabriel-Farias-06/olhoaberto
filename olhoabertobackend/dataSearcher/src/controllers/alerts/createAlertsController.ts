import { Alerts } from "@/infra/db";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name || !description)
    res.status(400).json({ message: "Todos os campos são obrigatórios." });

  try {
    const userId = req?.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Não autenticado." });
    }

    const alert = new Alerts({ title: name, description, user: userId });
    await alert.save();

    res.status(201).json({ message: "Alerta criado com sucesso.", alert });
  } catch (err) {
    console.error("Erro ao criar alerta:", err);
    res.status(500).json({ message: "Erro interno ao criar alerta." });
  }
};
