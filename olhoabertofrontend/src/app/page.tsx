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

  const userMenuRef = useRef<HTMLDivElement>(null);
  const userIconRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);
  const openModal = (tab: string) => {
    setActiveTab(tab);
    setShowModal(true);
  };

  const toggleTheme = () => setIsLightMode((prev) => !prev);

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
            
            if(Array.isArray(partialSources)) {
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

   

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

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


  return (
    <AppContainer>

      <Sidebar isOpen={isOpen}>
        <SidebarHeader>
          <button className="mode-open-close" aria-label="Alterar modo aberto/fechado" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} className="fa-solid fa-bars"/>
          </button>
          <FontAwesomeIcon icon={faSquarePlus} className="fa-regular fa-square-plus" />
        </SidebarHeader>
        <SidebarChats>
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
          {/* <FontAwesomeIcon icon={faRightFromBracket} className="fa-solid fa-right-from-bracket" /> */}
          <p>Sair</p>
        </SidebarFooter>
      </Sidebar>

      <ChatContainer>
        <ChatHeader>
          {!isOpen && (
            <button className="mode-open-close" aria-label="Alterar modo aberto/fechado" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} className="fa-solid fa-bars" />
            </button>
          )}

          <div className="box-left">
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
                  <button className="open-modal-btn" data-tab="logout">
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
                criar alerta
              </div>
              <div className={`tab-content ${activeTab !== "profile" ? "hidden" : ""}`} id="profile">
                <div className="profile-header">
                  <h2>Configurações do perfil</h2>
                </div>

                <div className="profile-section">
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

                </div>

              </div>
              <div className={`tab-content ${activeTab !== "admin" ? "hidden" : ""}`} id="admin">
                admin só admin
              </div>
            </ModalTabContent>

          </ModalBody>

        </ModalContent>
      </ModalOverlay>

    </AppContainer>
  );
}
