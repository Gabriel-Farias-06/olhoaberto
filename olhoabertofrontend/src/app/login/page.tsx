"use client";

import React from "react";

import "./login.css";

export default function Login() {
  return (
    <div className="login-page">
        <main className="login-container">

            <header className="login-header">
                <h2>Login</h2>
            </header>

            <section className="login-section">
                <label htmlFor="email" className="login-label email-text">Digite o seu E-mail</label>
                <input type="email" name="email" id="email" className="login-input" placeholder="Digite seu e-mail..." />
                
                <label htmlFor="password" className="login-label password-text">Digite a sua senha</label>
                <input type="password" name="password" id="password" className="login-input" placeholder="Digite sua senha..." />
                <div className="login-section-box">
                    <p>
                       <a href="./cadastro">Não tem uma conta? Clique aqui</a> 
                    </p>
                    <div className="login-button-group">
                        <button type="button" className="login-button cancel">Cancelar</button>
                        <button type="submit" className="login-button enter">Entrar</button>
                    </div>
                </div>
            </section>

            <footer className="login-footer">
                <div className="login-alert">
                </div>
            </footer>
        </main>
    </div>
  );
}
