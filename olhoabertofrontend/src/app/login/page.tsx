"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/context/ThemeContext";
import { axios } from "@/lib";

export default function Login() {
  const router = useRouter();
  const { setUser } = useTheme();

  const [formData, setFormData] = useState({
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
      const response = await axios.post(
        "http://localhost:4040/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.status) {
        throw new Error("Email ou senha inválidos");
      }

      const { accessToken, user } = await response.data;
      localStorage.setItem("accessToken", JSON.stringify(accessToken));
      setUser(user);

      setMessage("Login feito com sucesso! Redirecionando...");
      setMessageType("succes");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || "Erro ao fazer login");
      setMessageType("error");
    }
  };

  return (
    <div className="login-page">
      <main className="login-container">
        <header className="login-header">
          <h2>Login</h2>
        </header>

        <form onSubmit={handleSubmit}>
          <section className="login-section">
            <label htmlFor="email" className="login-label email-text">
              Digite o seu E-mail
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="login-input"
              placeholder="Digite seu e-mail..."
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password" className="login-label password-text">
              Digite a sua senha
            </label>
            <div className="login-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="login-input password"
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
            <div className="login-section-box">
              <p>
                <a href="http://localhost:3000/cadastro">
                  Não tem uma conta? Clique aqui
                </a>
              </p>
              <div className="login-button-group">
                <button
                  type="button"
                  className="login-button cancel"
                  onClick={() => setFormData({ email: "", password: "" })}
                >
                  Cancelar
                </button>
                <button type="submit" className="login-button enter">
                  Entrar
                </button>
              </div>
            </div>
          </section>
        </form>

        <footer className="login-footer">
          <div className={`login-alert ${messageType}`}>
            {message && <p>{message}</p>}
          </div>
        </footer>
      </main>
    </div>
  );
}
