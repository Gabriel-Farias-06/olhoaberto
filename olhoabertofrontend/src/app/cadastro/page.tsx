"use client";

import React from "react";

import "./cadastro.css";

export default function Cadastro() {
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
                <input type="password" name="password" id="password" className="cadastro-input" placeholder="Digite sua senha..."/>
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
