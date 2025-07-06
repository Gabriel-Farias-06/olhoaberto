import { Alerts } from "@/infra/db";
import { logger } from "@/utils";
import { Request, Response } from "express";

export default async function deleteAlertController(
  req: Request,
  res: Response
) {
  try {
    const alert = await Alerts.findOne({
      _id: req.params.id,
      user: req.user?._id,
    }).lean();

    if (!alert) res.status(400).json({ message: "Alerta não encontrado." });

    res.status(200).json({ alert });
  } catch (err) {
    logger(err);
    res.status(500).json({ message: "Erro ao buscar alerta." });
  }
}
