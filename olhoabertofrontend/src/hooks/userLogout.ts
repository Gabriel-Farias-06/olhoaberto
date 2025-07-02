"use client";

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

      const res = await fetch("http://localhost:4040/logout", { headers });
      console.log(res);

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        alert("Erro ao sair: " + data.message);
      }
    } catch (error) {
      console.error("Erro no logout:", error);
      alert("Erro inesperado ao tentar sair.");
    }
  }

  return { handleLogout };
}
