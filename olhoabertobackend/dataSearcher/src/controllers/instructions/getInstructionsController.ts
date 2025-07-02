import { IAConfig } from "@/infra/db";
import { logger } from "@/utils";
import { Request, Response } from "express";

export default async function deleteAlertController(
  req: Request,
  res: Response
) {
  if (req.user?.role !== "admin")
    res.status(403).json({ message: "Acesso negado." });

  try {
    const config = await IAConfig.findOne();
    res.status(200).json({ instructions: config?.instructions || "" });
  } catch (e) {
    logger(e);
    res.status(500).json({ message: "Erro ao buscar configurações." });
  }
}
