import { Alerts } from "@/infra/db";

export default async function deleteAlertController(req: any, res: any) {
  const alertId = req.params.id;

  if (!req.session?.user) {
    return res.status(401).json({ message: "Não autenticado." });
  }

  try {
    const deleted = await Alerts.findOneAndDelete({
      _id: alertId,
      user: req.session.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Alerta não encontrado." });
    }

    return res.status(200).json({ message: "Alerta deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar alerta:", err);
    return res.status(500).json({ message: "Erro ao deletar alerta." });
  }
}
