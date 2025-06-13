import { Alerts } from "@/infra/db";

export default async (req: any, res: any) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Não autenticado." });
    }

    const alert = new Alerts({ title: name, description, user: userId }); 
    await alert.save();

    return res.status(201).json({ message: "Alerta criado com sucesso.", alert });
  } catch (err) {
    console.error("Erro ao criar alerta:", err);
    return res.status(500).json({ message: "Erro interno ao criar alerta." });
  }
};
