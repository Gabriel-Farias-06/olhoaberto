"use client";

import { axios } from "@/lib";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const headers: HeadersInit = {
        Authorization: `Bearer ${localStorage
          .getItem("accessToken")
          ?.replaceAll('"', "")}`,
        "Content-Type": "application/json",
      };

      const res = await axios.get("http://localhost:4040/logout", { headers });

      if (res.status) {
        router.push("/login");
      } else {
        const data = await res.data;
        alert("Erro ao sair: " + data.message);
      }
    } catch (error) {
      console.error("Erro no logout:", error);
      alert("Erro inesperado ao tentar sair.");
    }
  }

  return { handleLogout };
}
