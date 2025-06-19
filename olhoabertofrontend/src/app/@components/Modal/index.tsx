"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUserGear,
  faXmark,
  faEye,
  faEyeSlash,
  faBell as faBellSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

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
import { useRouter } from "next/navigation";
import { UserData } from "@/types/User";

import ModalConfirm from "./ModalConfirm";

interface ModalProps {
  closeModal: () => void;
  user: UserData;
  setUser: (user: UserData) => void;
  initialTab: "alert" | "profile" | "admin";
}

export default function Modal({ closeModal, user, initialTab }: ModalProps) {
  const [activeTab, setActiveTab] = useState<"alert" | "profile" | "admin">(
    initialTab
  );

  const [showConfirmDeleteUser, setShowConfirmDeleteUser] = useState(false);
  const [showConfirmSaveUser, setShowConfirmSaveUser] = useState(false);
  const [showConfirmSaveAdmin, setShowConfirmSaveAdmin] = useState(false);
  const [
    showConfirmDeleteAllConversations,
    setShowConfirmDeleteAllConversations,
  ] = useState(false);

  const [showConfirmCreateAlert, setShowConfirmCreateAlert] = useState(false);
  const [alertName, setAlertName] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [userPassword, setUserPassword] = useState("");

  const [instructions, setInstructions] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const handleConfirmSaveAdmin = () => {
    fetch("http://localhost:4040/instructions", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ instructions }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar instruções");
        return res.json();
      })
      .then(() => {
        setShowConfirmSaveAdmin(false);
        alert("Instruções salvas com sucesso!");
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao salvar instruções.");
      });
  };

  useEffect(() => {
    if (activeTab === "admin") {
      fetch("http://localhost:4040/instructions", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setInstructions(data.instructions || ""))
        .catch((err) => console.error("Erro ao buscar instruções:", err));
    }
  }, [activeTab]);

  const handleConfirmCreateAlert = async () => {
    try {
      const form = document.getElementById(
        "alert-create-form"
      ) as HTMLFormElement;
      const formData = new FormData(form);

      const name = formData.get("alertName")?.toString().trim() || "";
      const description =
        formData.get("alertDescription")?.toString().trim() || "";

      console.log("name:", name);
      console.log("description:", description);

      if (!name || !description) {
        alert("Preencha todos os campos.");
        return;
      }

      const response = await fetch("http://localhost:4040/alert", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }), // <-- aqui é "name"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar alerta.");
      }

      setShowConfirmCreateAlert(false);
      alert("Alerta criado com sucesso!");
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar alerta:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Erro desconhecido ao criar alerta.");
      }
    }
  };

  const handleConfirmDeleteUser = async () => {
    try {
      const response = await fetch("http://localhost:4040/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password: userPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao deletar conta.");
      }

      await fetch("http://localhost:4040/logout", {
        method: "POST",
        credentials: "include",
      });

      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao deletar conta:", error.message);
        alert(error.message);
      }
    } finally {
      setShowConfirmDeleteUser(false);
    }
  };

  const handleConfirmSaveUser = async () => {
    const newName = (document.getElementById("username") as HTMLInputElement)
      ?.value;
    const actualPassword = (
      document.getElementById("oldpassword") as HTMLInputElement
    )?.value;
    const newPassword = (
      document.getElementById("newpassword") as HTMLInputElement
    )?.value;

    if (!actualPassword || (!newName && !newPassword)) {
      alert("Informe a senha atual e pelo menos um novo dado para atualizar.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4040/updateUser", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actualPassword,
          newName,
          newPassword,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Erro ao atualizar o perfil.");
      }

      const result = await response.json();
      console.log(result.message);

      setShowConfirmSaveUser(false);

      await fetch("http://localhost:4040/logout", {
        method: "POST",
        credentials: "include",
      });

      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil. Verifique sua senha e tente novamente.");
    }
  };

  const handleConfirmDeleteAllConversations = async () => {
    try {
      const response = await fetch("http://localhost:4040/conversations", {
        method: "DELETE",
        credentials: "include",
      });

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Response data:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Erro ao deletar todas as conversas."
          );
        }
      } else {
        const text = await response.text();
        console.log("Resposta não JSON:", text);

        if (!response.ok) {
          throw new Error(text || "Erro ao deletar todas as conversas.");
        }
      }

      setShowConfirmDeleteAllConversations(false);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao deletar todas as conversas:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro desconhecido.");
      }
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Configurações</h2>
          <button onClick={closeModal}>
            <div className="box-xmark">
              <FontAwesomeIcon icon={faXmark} className="fa-solid fa-xmark" />
            </div>
          </button>
        </ModalHeader>

        <ModalBody>
          <ModalSidebar>
            <ul>
              <li>
                <button
                  className={activeTab === "alert" ? "active" : ""}
                  onClick={() => setActiveTab("alert")}
                >
                  <FontAwesomeIcon
                    icon={faBellSolid}
                    className="fa-regular fa-bell"
                  />{" "}
                  Alertas
                </button>
              </li>
              <li>
                <button
                  className={activeTab === "profile" ? "active" : ""}
                  onClick={() => setActiveTab("profile")}
                >
                  <FontAwesomeIcon icon={faGear} className="fa-solid fa-gear" />{" "}
                  Perfil
                </button>
              </li>
              {user?.role === "admin" && (
                <li>
                  <button
                    className={activeTab === "admin" ? "active" : ""}
                    onClick={() => setActiveTab("admin")}
                  >
                    <FontAwesomeIcon
                      icon={faUserGear}
                      className="fa-solid fa-user-gear"
                    />{" "}
                    Admin
                  </button>
                </li>
              )}
            </ul>
          </ModalSidebar>

          <ModalTabContent>
            <div
              className={`tab-content ${activeTab !== "alert" ? "hidden" : ""}`}
              id="alert"
            >
              <div className="alert-header">
                <h2>Criar Alerta</h2>
              </div>

              <form id="alert-create-form" className="alert-section">
                <label htmlFor="alertName" className="alert-label">
                  Digite o nome do alerta
                </label>
                <input
                  type="text"
                  className="alert-input"
                  name="alertName"
                  id="alertName"
                  placeholder="Nome do alerta..."
                  required
                />

                <label htmlFor="alertDescription" className="alert-label">
                  Descreva como o alerta deve agir
                </label>
                <textarea
                  className="alert-input"
                  name="alertDescription"
                  id="alertDescription"
                  placeholder="Descreva como o alerta deve agir..."
                  rows={4}
                  required
                ></textarea>

                <div className="alert-buttons">
                  <button
                    type="button"
                    className="alert-button cancel"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="alert-button create"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirmCreateAlert(true);
                    }}
                  >
                    Criar
                  </button>
                </div>

                <footer className="alert-footer">
                  <div className="alert-alert"></div>
                </footer>
              </form>
            </div>

            <div
              className={`tab-content ${
                activeTab !== "profile" ? "hidden" : ""
              }`}
              id="profile"
            >
              <div className="profile-header">
                <h2>Configurações do perfil</h2>
              </div>

              <form id="profile-config-form" className="profile-section">
                <label htmlFor="newusername" className="profile-label">
                  Digite como o chat deve te chamar
                </label>
                <input
                  type="text"
                  className="profile-input"
                  name="newusername"
                  id="username"
                  placeholder="Digite como o chat deve te chamar..."
                />

                <label htmlFor="oldpassword" className="profile-label">
                  Digite sua senha atual
                </label>
                <div className="profile-input-wrapper">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    className="profile-input"
                    name="oldpassword"
                    id="oldpassword"
                    placeholder="Digite sua senha atual..."
                  />
                  <FontAwesomeIcon
                    icon={showOldPassword ? faEyeSlash : faEye}
                    className="fa fa-eye toggle-password"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  />
                </div>

                <label htmlFor="newpassword" className="profile-label">
                  Digite sua nova senha
                </label>
                <div className="profile-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="profile-input"
                    name="newpassword"
                    id="newpassword"
                    placeholder="Digite sua nova senha..."
                  />
                  <FontAwesomeIcon
                    icon={showNewPassword ? faEyeSlash : faEye}
                    className="fa fa-eye toggle-password"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                </div>

                <div className="profile-buttons">
                  <button
                    type="button"
                    className="profile-button cancel"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="profile-button save"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirmSaveUser(true);
                    }}
                  >
                    Salvar
                  </button>
                </div>

                <footer className="profile-footer">
                  <div className="profile-alert"></div>
                </footer>
              </form>

              <div className="profile-delete-all-conversations">
                <h4>Deletar Todas as Conversas</h4>
                <button
                  type="button"
                  className="profile-button-delete-all-conversations"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConfirmDeleteAllConversations(true);
                  }}
                >
                  Excluir
                </button>
              </div>

              <form
                className="profile-delet"
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowConfirmDeleteUser(true);
                }}
              >
                <h4>Deletar sua conta</h4>

                <label htmlFor="delete-password" className="profile-label">
                  Digite sua senha para confirmar
                </label>
                <div className="profile-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="profile-input"
                    name="delete-password"
                    id="delete-password"
                    placeholder="Digite sua senha..."
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                  <FontAwesomeIcon
                    icon={showNewPassword ? faEyeSlash : faEye}
                    className="fa fa-eye toggle-password"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                </div>

                <div className="profile-delet-button-wrapper">
                  <button type="submit" className="profile-button-delet">
                    Excluir
                  </button>
                </div>
              </form>
            </div>

            <div
              className={`tab-content ${activeTab !== "admin" ? "hidden" : ""}`}
              id="admin"
            >
              <div className="admin-header">
                <h2>Configurações do Modelo</h2>
              </div>

              <form id="admin-config-form" className="admin-section">
                {/* <label htmlFor="max_output_tokens" className="admin-label">Número máximo de tokens</label>
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
                                /> */}

                <label htmlFor="adminDescription" className="admin-label">
                  Instruções para IA
                </label>
                <textarea
                  className="admin-input input-textarea"
                  name="adminDescription"
                  id="adminDescription"
                  rows={4}
                  required
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder={
                    instructions.trim() === ""
                      ? "Sem instruções para a IA."
                      : "Descreva as instruções de como a IA deve agir..."
                  }
                ></textarea>

                <div className="admin-buttons">
                  <button
                    type="button"
                    className="admin-button cancel"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="admin-button save"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirmSaveAdmin(true);
                    }}
                  >
                    Salvar
                  </button>
                </div>

                <footer className="admin-footer">
                  <div className="admin-alert"></div>
                </footer>
              </form>
            </div>
          </ModalTabContent>

          <ModalConfirm
            isOpen={showConfirmCreateAlert}
            title="Criar Alerta"
            message=" Você está prestes a criar um alerta. Deseja confirmar a criação deste alerta?"
            confirmText="Criar"
            cancelText="Cancelar"
            onConfirm={handleConfirmCreateAlert}
            onCancel={() => setShowConfirmCreateAlert(false)}
          />

          <ModalConfirm
            isOpen={showConfirmDeleteUser}
            title="Deletar Conta"
            message="Ao confirmar esta ação, sua conta será permanentemente excluída do sistema, incluindo todas as suas informações e preferências. Esta ação não poderá ser desfeita. Tem certeza que deseja continuar?"
            confirmText="Excluir"
            cancelText="Cancelar"
            onConfirm={handleConfirmDeleteUser}
            onCancel={() => setShowConfirmDeleteUser(false)}
          />

          <ModalConfirm
            isOpen={showConfirmSaveUser}
            title="Salvar Alterações"
            message=" Você está prestes a salvar alterações nas suas configurações de perfil. Isso inclui nome, senha ou os dois. Deseja confirmar essas mudanças?"
            confirmText="Salvar"
            cancelText="Cancelar"
            onConfirm={handleConfirmSaveUser}
            onCancel={() => setShowConfirmSaveUser(false)}
          />

          <ModalConfirm
            isOpen={showConfirmSaveAdmin}
            title="Salvar Alterações Admin"
            message="Ao confirmar, as configurações do modelo de IA serão atualizadas isso muda como funciona as respostas da IA. Tem certeza de que deseja aplicar essas alterações?"
            confirmText="Salvar"
            cancelText="Cancelar"
            onConfirm={handleConfirmSaveAdmin}
            onCancel={() => setShowConfirmSaveAdmin(false)}
          />

          <ModalConfirm
            isOpen={showConfirmDeleteAllConversations}
            title="Deletar Todas as Conversas"
            message="Ao confirmar, todas as suas conversas serão permanentemente excluídas. Esta ação não poderá ser desfeita. Tem certeza que deseja continuar?"
            confirmText="Excluir Todas"
            cancelText="Cancelar"
            onConfirm={handleConfirmDeleteAllConversations}
            onCancel={() => setShowConfirmDeleteAllConversations(false)}
          />
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}
