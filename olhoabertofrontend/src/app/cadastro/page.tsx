"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import "./cadastro.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Cadastro() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "succes" | "">("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    try {
      console.log("Enviando dados:", formData);
      const response = await fetch("http://localhost:4040/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Dados inválidos ou usuário já cadastrado");
      }

      const data = await response.json();
      console.log("Cadastrado com sucesso", data);

      setMessage("Cadastro realizado com sucesso! Redirecionando...");
      setMessageType("succes");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setMessage(err.message || "Erro ao cadastrar");
      setMessageType("error");
    }
  };

  return (
    <div className="cadastro-page">
      <main className="cadastro-container">
        <header className="cadastro-header">
          <h1>Criar perfil</h1>
        </header>

        <form onSubmit={handleSubmit}>
          <section className="cadastro-section">
            <label htmlFor="name" className="cadastro-label name-text">
              Digite seu nome
            </label>
            <input
              type="name"
              name="name"
              id="name"
              className="cadastro-input"
              placeholder="Digite seu nome..."
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email" className="cadastro-label email-text">
              Digite o seu email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="cadastro-input"
              placeholder="Digite sua E-mail..."
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password" className="cadastro-label password-text">
              Digite a sua senha
            </label>
            <div className="cadastro-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="cadastro-input password"
                placeholder="Digite sua senha..."
                value={formData.password}
                onChange={handleChange}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="fa fa-eye toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="password-requirements">
              <strong>
                <p>Sua senha precisa conter:</p>
              </strong>
              <ul>
                <li>Pelo menos 8 caracteres</li>
                <li>Pelo menos uma letra maiúscula (A-Z)</li>
                <li>Pelo menos uma letra minúscula (a-z)</li>
                <li>Pelo menos um número (0-9)</li>
                <li>Pelo menos um caractere especial (como !@#$%^&*)</li>
              </ul>
            </div>

            <div className="cadastro-section-box">
              <p>
                <a href="./login">Já tem uma conta? Clique aqui</a>
              </p>
              <div className="cadastro-button-group">
                <button
                  type="button"
                  className="cadastro-button cancel"
                  onClick={() =>
                    setFormData({ name: "", email: "", password: "" })
                  }
                >
                  Cancelar
                </button>
                <button type="submit" className="cadastro-button enter">
                  Criar
                </button>
              </div>
            </div>
          </section>
        </form>

        <footer className="cadastro-footer">
          <div className={`cadastro-alert ${messageType}`}>
            {message && <p>{message}</p>}
          </div>
        </footer>
      </main>
    </div>
  );
}
