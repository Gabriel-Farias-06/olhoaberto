import { Alerts } from "@/infra/db";
import { Request, Response } from "express";

export default async function deleteAlertController(
  req: Request,
  res: Response
) {
  const alertId = req.params.id;

  try {
    const deleted = await Alerts.findOneAndDelete({
      _id: alertId,
      user: req.user?._id as string,
    });

    if (!deleted) res.status(404).json({ message: "Alerta não encontrado." });

    res.status(200).json({ message: "Alerta deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar alerta:", err);
    res.status(500).json({ message: "Erro ao deletar alerta." });
  }
}
