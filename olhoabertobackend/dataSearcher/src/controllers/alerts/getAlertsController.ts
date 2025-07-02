import { Alerts } from "@/infra/db";
import { Request, Response } from "express";

export default async function deleteAlertController(
  req: Request,
  res: Response
) {
  try {
    const alerts = await Alerts.find({ user: req.user?._id as string }).lean();

    res.status(200).json({ alerts });
  } catch (err) {
    console.error("Erro ao buscar alertas:", err);
    res.status(500).json({ message: "Erro ao buscar alertas." });
  }
}
