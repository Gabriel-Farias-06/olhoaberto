"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faRightFromBracket,
  faCircleHalfStroke,
  faGear,
  faUserGear,
  faXmark,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import {
  faSquarePlus,
  faBell,
  faCircleUser,
  faPaperPlane
} from '@fortawesome/free-regular-svg-icons';

import { useEffect, useState, useRef } from "react";
import {
  AppContainer,
  Sidebar,
  SidebarHeader,
  SidebarChats,
  SidebarFooter,
  ChatContainer,
  ChatHeader,
  ChatMessages,
  ChatInput,
  UserMenu,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalSidebar,
  ModalTabContent,
} from "./page.styles";
import { marked } from "marked";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { mark, script } from 'framer-motion/client';
import { useRouter } from 'next/navigation';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';

type QuerySources = {
  pdfPage: string;
  path: string;
  date: string;
};

type QueryAnswer = {
  answer: string;
  sources: QuerySources[];
};

type Message = {
  sender: "user" | "bot";
  text: string;
}


export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null)

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<QueryAnswer>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("alert");
  const [isLightMode, setIsLightMode] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const userIconRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => setIsLightMode((prev) => !prev);
  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);

  const openModal = (tab: string) => {
    setActiveTab(tab);
    setShowModal(true);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  const submitQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setQuery("");

    try {

      const res = await fetch(`http://localhost:4000/stream?q=${query}`);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let responseText = ""
      let sources: QuerySources[] = []
      let fullStreamLog = "";

      while (true) {
        if (!reader) break;

        const { done, value } = await reader?.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          fullStreamLog += line + "\n";

          try {
            const { answer, sources: partialSources } = JSON.parse(line);
            responseText = answer;

            if (Array.isArray(partialSources)) {
              sources = partialSources;
            }
          } catch (err) {
            console.error("Erro ao parsear linha", err)
            console.log("Linha com erro:", line)
          }
        }
      }

      console.log("Resposta completa do backend:", fullStreamLog);

      if (responseText.trim()) {
        const htmlAnswer = await marked(responseText);

        setMessages((prev) => [...prev, { sender: "bot", text: htmlAnswer }]);
        setAnswer({
          answer: htmlAnswer,
          sources: sources,
        });
      } else { //sem resposta do bot
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Desculpa, não encontrei uma resposta para isso :'(" },
        ])
      }
    } catch (err) { // Erro de rede ou api
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Erro ao buscar resposta. Tente novamente." },
      ])
    } finally {
      setIsLoading(false);
    }
  };

  async function handleLogout() {
    try {
      const res = await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/login")
      } else {
        const data = await res.json();
        alert("Erro ao sair: " + data.message)
      }
    } catch (error) {
      console.error("Erro no logout:", error);
      alert("Erro inesperado ao tentar sair.")
    }
  }

  useEffect(() => {
    console.log(answer);
  }, [answer]);

  useEffect(() => {
    const html = document.documentElement;

    if (isLightMode) {
      html.classList.add("light")
    } else {
      html.classList.remove("light")
    }
  }, [isLightMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("http://localhost:4000/me", {
        credentials: "include",
      });

      const data = await res.json();
      console.log('Status da resposta:', data);

      if (!res.ok) {
        router.push("/login");
      } else {
        setUserName(data.user?.name || null)
      }
    }
    checkAuth();
  }, [router]);

  return (
    <AppContainer>

      <Sidebar $isOpen={isOpen}>
        <SidebarHeader>
          <button className="mode-open-close" aria-label="Alterar modo aberto/fechado" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} className="fa-solid fa-bars" />
          </button>
          <FontAwesomeIcon icon={faSquarePlus} className="fa-regular fa-square-plus" />
        </SidebarHeader>
        <SidebarChats>
          <div className="name-user">
            {userName ? `Olá, ${userName}` : "Carregando..."}
          </div>
          <div className="chat-group">
            <p>Hoje</p>
            <ul className="conversation-list">
              <li>Investimentos na educação DF</li>
              <li>Renda Anual SP</li>
            </ul>
          </div>
          <div className="chat-group">
            <p>Ontem</p>
            <ul className="conversation-list">
              <li>Consulta de dados pessoais</li>
              <li>Quanto o governo investiu em saúde em 2023 e 2024</li>
            </ul>
          </div>
        </SidebarChats>
        <SidebarFooter>
          <button className="sidebar-footer-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="fa-solid fa-right-from-bracket" />
            <p>Sair</p>
          </button>
        </SidebarFooter>
      </Sidebar>

      <ChatContainer>
        <ChatHeader>
          <div className="box-left">
            {!isOpen && (
              <button className="mode-open-close" aria-label="Alterar modo aberto/fechado" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} className="fa-solid fa-bars" />
              </button>
            )}

            <div className="notify-icon">
              <FontAwesomeIcon icon={faBell} className="fa-regular fa-bell" />
            </div>
          </div>

          <div className="box-right">
            <button className="mode-dark-light" aria-label="Alterar modo escuro/claro" onClick={toggleTheme}>
              <FontAwesomeIcon icon={faCircleHalfStroke} className="fa-solid fa-circle-half-stroke" />
            </button>
            <div ref={userIconRef} className="user-icon" onClick={toggleUserMenu}>
              <FontAwesomeIcon icon={faCircleUser} className="fa-regular fa-circle-user" />
              <UserMenu ref={userMenuRef} className={showUserMenu ? "user-menu" : "hidden"}>
                <li className="item alert">
                  <button className="open-modal-btn" onClick={() => openModal("alert")}>
                    <FontAwesomeIcon icon={faBell} className="fa-regular fa-bell" /> Configurar Alertas
                  </button>
                </li>
                <li className="item profile">
                  <button className="open-modal-btn" onClick={() => openModal("profile")}>
                    <FontAwesomeIcon icon={faGear} className="fa-solid fa-gear" /> Configurar Perfil
                  </button>
                </li>
                <li className="item admin">
                  <button className="open-modal-btn" onClick={() => openModal("admin")}>
                    <FontAwesomeIcon icon={faUserGear} className="fa-solid fa-user-gear" /> Administrador
                  </button>
                </li>
                <li className="item logout">
                  <button className="open-modal-btn" data-tab="logout" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} className="fa-solid fa-right-from-bracket" /> Sair
                  </button>
                </li>
              </UserMenu>
            </div>
          </div>
        </ChatHeader>

        <ChatMessages>
          <div className="message user">Quanto o governo investiu em educação?</div>
          <div className="message bot">Em 2025, foi investido quantos reais em educação?</div>

          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          ))}

          {isLoading && (
            <div className="message bot loading">
              Buscando resposta...
            </div>
          )}

        </ChatMessages>

        <ChatInput>
          <input type="text"
            placeholder={isLoading ? "Buscando resposta..." : "Digite sua pergunta..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitQuery()
            }}
            disabled={isLoading}
          />

          <button onClick={submitQuery}>
            <FontAwesomeIcon icon={faPaperPlane} className="fa-regular fa-paper-plane" />
          </button>
        </ChatInput>

      </ChatContainer>

      <ModalOverlay className={showModal ? "" : "hidden"}>
        <ModalContent>

          <ModalHeader>
            <h2>Configurações</h2>
            <FontAwesomeIcon
              icon={faXmark}
              className="fa-solid fa-xmark"
              onClick={() => setShowModal(false)}
            />
          </ModalHeader>

          <ModalBody>
            <ModalSidebar>
              <ul>
                <li>
                  <button className={activeTab === "alert" ? "active" : ""} onClick={() => setActiveTab("alert")} >
                    <FontAwesomeIcon icon={faBell} className="fa-regular fa-bell" /> Alertas
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

    </AppContainer>
  );
}
