// === CONTROLLER ===
import { Alerts } from "@/infra/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (req: any, res: any) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    const alerts = new Alerts({ name, description, user: res.session.user.id });
    await alerts.save();
    return res
      .status(201)
      .json({ message: "Alerta criado com sucesso.", alert });
  } catch (err) {
    console.error("Erro ao criar alerta:", err);
    return res.status(500).json({ message: "Erro interno ao criar alerta." });
  }
};
