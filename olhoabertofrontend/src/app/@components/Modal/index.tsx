"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGear,
    faUserGear,
    faXmark,
    faEye,
    faEyeSlash,
    faBell as faBellSolid
} from '@fortawesome/free-solid-svg-icons';
import {
    faPaperPlane
} from '@fortawesome/free-regular-svg-icons';

import { useEffect, useState, useRef } from "react";
import {
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalSidebar,
    ModalTabContent,
} from "./styles";
import { marked } from "marked";
import { useRouter } from 'next/navigation';
import { UserData } from '@/types/User';


interface ModalProps {
    closeModal: () => void;
    user: UserData
    setUser: (user: UserData) => void;
}


export default function Modal({ closeModal, user }: ModalProps) {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [activeTab, setActiveTab] = useState("alert");

    return (
        <ModalOverlay>
            <ModalContent>

                <ModalHeader>
                    <h2>Configurações</h2>
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="fa-solid fa-xmark"
                        onClick={closeModal}
                    />
                </ModalHeader>

                <ModalBody>
                    <ModalSidebar>
                        <ul>
                            <li>
                                <button className={activeTab === "alert" ? "active" : ""} onClick={() => setActiveTab("alert")} >
                                    <FontAwesomeIcon icon={faBellSolid} className="fa-regular fa-bell" /> Alertas
                                </button>
                            </li>
                            <li>
                                <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")} >
                                    <FontAwesomeIcon icon={faGear} className="fa-solid fa-gear" /> Perfil
                                </button>
                            </li>
                            <li>
                                <button className={activeTab === "admin" ? "active" : ""} onClick={() => setActiveTab("admin")} >
                                    <FontAwesomeIcon icon={faUserGear} className="fa-solid fa-user-gear" /> Admin
                                </button>
                            </li>
                        </ul>
                    </ModalSidebar>

                    <ModalTabContent>
                        <div className={`tab-content ${activeTab !== "alert" ? "hidden" : ""}`} id="alert">
                            <div className="alert-header">
                                <h2>Criar Alerta</h2>
                            </div>

                            <form id="alert-create-form" className="alert-section">
                                <label htmlFor="alertName" className="alert-label">Digite o nome do alerta</label>
                                <input
                                    type="text"
                                    className="alert-input"
                                    name="alertName"
                                    id="alertName"
                                    placeholder="Nome do alerta..."
                                    required
                                />

                                <label htmlFor="alertDescription" className="alert-label">Descreva como o alerta deve agir</label>
                                <textarea
                                    className="alert-input"
                                    name="alertDescription"
                                    id="alertDescription"
                                    placeholder="Descreva como o alerta deve agir..."
                                    rows={4}
                                    required
                                ></textarea>

                                <div className="alert-buttons">
                                    <button type="button" className="alert-button cancel">Cancelar</button>
                                    <button type="submit" className="alert-button create">Criar</button>
                                </div>

                                <footer className="alert-footer">
                                    <div className="alert-alert"></div>
                                </footer>
                            </form>
                        </div>


                        <div className={`tab-content ${activeTab !== "profile" ? "hidden" : ""}`} id="profile">
                            <div className="profile-header">
                                <h2>Configurações do perfil</h2>
                            </div>

                            <form id="profile-config-form" className="profile-section">
                                <label htmlFor="newusername" className="profile-label">Digite como o chat deve te chamar</label>
                                <input type="text" className="profile-input" name="newusername" id="username" placeholder="Digite como o chat deve te chamar..." />

                                <label htmlFor="oldpassword" className="profile-label">Digite sua senha atual</label>
                                <div className="profile-input-wrapper">
                                    <input type={showOldPassword ? "text" : "password"} className="profile-input" name="oldpassword" id="oldpassword" placeholder="Digite sua senha atual..." />
                                    <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} className="fa fa-eye toggle-password"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                    />
                                </div>

                                <div className="profile-checkbox">
                                    <input type="checkbox" name="change-password" id="change-password" />
                                    <label htmlFor="change-password">Desejo alterar a minha senha</label>
                                </div>

                                <label htmlFor="newpassword" className="profile-label">Digite sua nova senha</label>
                                <div className="profile-input-wrapper">
                                    <input type={showNewPassword ? "text" : "password"} className="profile-input" name="newpassword" id="newpassword" placeholder="Digite sua nova senha..." />
                                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} className="fa fa-eye toggle-password"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    />
                                </div>

                                <div className="profile-buttons">
                                    <button type="button" className="profile-button cancel">Cancelar</button>
                                    <button type="submit" className="profile-button save">Salvar</button>
                                </div>

                                <footer className="profile-footer">
                                    <div className="profile-alert">
                                    </div>
                                </footer>

                            </form>

                            <div className="profile-delet">
                                <h2>Deletar sua conta</h2>
                                <button type="submit" className="profile-button-delet">Excluir Conta</button>
                            </div>

                        </div>

                        <div className={`tab-content ${activeTab !== "admin" ? "hidden" : ""}`} id="admin">
                            <div className="admin-header">
                                <h2>Configurações do Modelo</h2>
                            </div>

                            <form id="admin-config-form" className="admin-section">
                                <label htmlFor="max_output_tokens" className="admin-label">Número máximo de tokens</label>
                                <input
                                    type="number"
                                    className="admin-input"
                                    name="max_output_tokens"
                                    id="max_output_tokens"
                                    placeholder="Ex: 2048"
                                    min="1"
                                    max="2048"
                                    required
                                />

                                <label htmlFor="temperature" className="admin-label">Temperatura (criatividade/aleatoriedade)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="1"
                                    className="admin-input"
                                    name="temperature"
                                    id="temperature"
                                    placeholder="Ex: 0.4"
                                    required
                                />

                                <label htmlFor="top_p" className="admin-label">Top P (nucleus sampling)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="1"
                                    className="admin-input"
                                    name="top_p"
                                    id="top_p"
                                    placeholder="Ex: 1"
                                    required
                                />

                                <label htmlFor="top_k" className="admin-label">Top K</label>
                                <input
                                    type="number"
                                    className="admin-input"
                                    name="top_k"
                                    id="top_k"
                                    placeholder="Ex: 32"
                                    min="1"
                                    max="100"
                                    required
                                />

                                <div className="admin-buttons">
                                    <button type="button" className="admin-button cancel">Cancelar</button>
                                    <button type="submit" className="admin-button save">Salvar</button>
                                </div>

                                <footer className="admin-footer">
                                    <div className="admin-alert"></div>
                                </footer>
                            </form>
                        </div>

                    </ModalTabContent>

                </ModalBody>

            </ModalContent>
        </ModalOverlay>
    )
}


