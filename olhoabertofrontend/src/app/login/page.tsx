"use client";

import React from "react";

import "./login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

export default function Login() {
const [showPassword, setShowPassword] = useState(false);

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
                <div className="login-input-wrapper">
                    <input type={showPassword ? "text" : "password"} id="password" className="login-input password" placeholder="Digite sua senha..." />
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="fa fa-eye toggle-password" 
                    onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
                
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
