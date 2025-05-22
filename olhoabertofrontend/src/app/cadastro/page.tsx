"use client";

import React from "react";

import "./cadastro.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

export default function Cadastro() {
const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="cadastro-page">
        <main className="cadastro-container">

            <header className="cadastro-header">
                <h1>Criar perfil</h1>
            </header>

            <section className="cadastro-section">
                <label htmlFor="name" className="cadastro-label name-text">Digite seu nome</label>
                <input type="name" name="name" id="name" className="cadastro-input" placeholder="Digite seu nome..." />
                
                <label htmlFor="email" className="cadastro-label email-text">Digite o seu email</label>
                <input type="email" name="email" id="email" className="cadastro-input" placeholder="Digite sua E-mail..."/>

                <label htmlFor="password" className="cadastro-label password-text">Digite a sua senha</label>
                <div className="cadastro-input-wrapper">
                    <input type={showPassword ? "text" : "password"} id="password" className="cadastro-input password" placeholder="Digite sua senha..." />
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="fa fa-eye toggle-password" 
                    onClick={() => setShowPassword(!showPassword)}
                    />
                </div>

                <div className="cadastro-section-box">
                    <p>
                       <a href="./login">Já tem uma conta? Clique aqui</a> 
                    </p>
                    <div className="cadastro-button-group">
                        <button type="button" className="cadastro-button cancel">Cancelar</button>
                        <button type="submit" className="cadastro-button enter">Criar</button>
                    </div>
                </div>
            </section>

            <footer className="cadastro-footer">
                <div className="cadastro-alert">
                    
                </div>
            </footer>
        </main>
    </div>
  )
}
