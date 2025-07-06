"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRightFromBracket,
  faCircleHalfStroke,
  faGear,
  faUserGear,
  faBell as faBellSolid,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBell,
  faCircleUser,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";

import { useEffect, useState, useRef } from "react";
import {
  ChatContainer,
  ChatHeader,
  ChatMessages,
  ChatInput,
  UserMenu,
} from "./styles";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import { UserData, Conversation, Alert } from "@/types/User";
import { Message } from "@/types/User";
import { useTheme } from "@/context/ThemeContext";
import { axios } from "@/lib";

type QuerySources = {
  pdfPage: string;
  path: string;
  date: string;
};

type QueryAnswer = {
  answer: string;
  sources: QuerySources[];
};

interface ChatProps {
  isOpen: boolean;
  user: UserData;
  toggleSidebar: () => void;
  openModal: (tab: "alert" | "profile" | "admin") => void;
  idItem: string | null;
  setIdItem: React.Dispatch<React.SetStateAction<string | null>>;
  selectedItem: Conversation | null | Alert;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onItemCreated: (item: any) => void;
  itemType: "conversation" | "alert";
}

export default function Chat({
  isOpen,
  toggleSidebar,
  openModal,
  idItem,
  setIdItem,
  selectedItem,
  setMessages,
  messages,
  onItemCreated,
  itemType,
}: ChatProps) {
  const router = useRouter();
  const { user } = useTheme();

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<QueryAnswer>();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  // const { handleLogout } = useLogout();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const userIconRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => setIsLightMode((prev) => !prev);
  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);

  const handleLogout = async () => {
    try {
      router.push("/login");
      await axios.get("/logout");
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Erro no logout:", error);
      alert("Erro inesperado ao tentar sair.");
    }
  };

  useEffect(() => {
    console.log({ idItem });
  }, [idItem]);

  const submitQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { content: query, role: "user" }]);
    setQuery("");

    try {
      //   let currentConversationId = idItem;
      //   console.log({ currentConversationId, idItem });

      //   console.log("Tentando criar conversa para o user:", user);
      //   if (!currentConversationId) {
      //     const res = await axios.post(
      //       `http://localhost:4040/conversations/${user._id}`,
      //       { title: query },
      //       {
      //         headers: { "Content-Type": "application/json" },
      //       }
      //     );

      //     if (!res.status) {
      //       throw new Error(`Erro ao criar conversa: status ${res.status}`);
      //     }

      //     const data = await res.data;
      //     const newConv = data.conversation;

      //     if (!newConv || !newConv._id) {
      //       throw new Error("Resposta inválida: conversa criada sem _id");
      //     }

      //     currentConversationId = newConv._id;
      //     onItemCreated(newConv); // <- Aqui está a atualização do user.conversations
      //   }

      const accessToken = localStorage.getItem("accessToken");
      const resStream = await fetch(
        `http://localhost:4040/stream?q=${encodeURIComponent(
          query
        )}&idItem=${idItem}&email=${encodeURIComponent(user.email)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken?.replaceAll('"', "")}`,
          },
        }
      );

      if (!resStream.ok) {
        throw new Error(
          `Erro ao buscar resposta do stream: status ${resStream.status}`
        );
      }

      const reader = resStream.body?.getReader();
      if (!reader) {
        throw new Error("Stream não disponível no corpo da resposta");
      }

      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let sources: QuerySources[] = [];
      let fullStreamLog = "";

      setIsLoading(false);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          fullStreamLog += line + "\n";

          try {
            const {
              streamArticles: { answer, sources: partialSources },
            } = JSON.parse(line);
            console.log({ answer });

            const htmlAnswer = await marked(answer);
            setMessages((prev) => {
              if (prev.length === 0) return prev;

              const lastMsg = prev[prev.length - 1];
              const updatedMsg: Message = {
                ...lastMsg,
                role: "assistant",
                content: lastMsg.content + htmlAnswer,
              };

              return [...prev.slice(0, -1), updatedMsg];
            });

            if (Array.isArray(partialSources)) {
              sources = partialSources;
            }
          } catch (err) {
            console.error("Erro ao parsear linha do stream:", err);
            console.log("Linha com erro:", line);
          }
        }
      }
    } catch (err) {
      console.error("Erro no submitQuery:", err);
      setMessages((prev) => [
        ...prev,
        {
          content: "Erro ao buscar resposta. Tente novamente.",
          role: "assistant",
        },
      ]);
    }
  };

  useEffect(() => {
    const html = document.documentElement;

    if (isLightMode) {
      html.classList.add("light");
    } else {
      html.classList.remove("light");
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
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = messagesEndRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]); // scrolls every time messages change

  return (
    <ChatContainer>
      <ChatHeader>
        <div className="box-left">
          {!isOpen && (
            <button
              className="mode-open-close"
              aria-label="Alterar modo aberto/fechado"
              onClick={toggleSidebar}
            >
              <FontAwesomeIcon icon={faBars} className="fa-solid fa-bars" />
            </button>
          )}

          <div className="notify-icon">
            <FontAwesomeIcon icon={faBell} className="fa-regular fa-bell" />
          </div>
        </div>

        <div className="box-right">
          <button
            className="mode-dark-light"
            aria-label="Alterar modo escuro/claro"
            onClick={toggleTheme}
          >
            <FontAwesomeIcon
              icon={faCircleHalfStroke}
              className="fa-solid fa-circle-half-stroke"
            />
          </button>
          <div ref={userIconRef} className="user-icon" onClick={toggleUserMenu}>
            <FontAwesomeIcon
              icon={faCircleUser}
              className="fa-regular fa-circle-user"
            />
            <UserMenu
              ref={userMenuRef}
              className={showUserMenu ? "user-menu" : "hidden"}
            >
              <li className="item alert">
                <button
                  className="open-modal-btn"
                  onClick={() => openModal("alert")}
                >
                  <FontAwesomeIcon
                    icon={faBellSolid}
                    className="fa-regular fa-bell"
                  />{" "}
                  Configurar Alertas
                </button>
              </li>
              <li className="item profile">
                <button
                  className="open-modal-btn"
                  onClick={() => openModal("profile")}
                >
                  <FontAwesomeIcon icon={faGear} className="fa-solid fa-gear" />{" "}
                  Configurar Perfil
                </button>
              </li>
              {user?.role === "admin" && (
                <li className="item admin">
                  <button
                    className="open-modal-btn"
                    onClick={() => openModal("admin")}
                  >
                    <FontAwesomeIcon
                      icon={faUserGear}
                      className="fa-solid fa-user-gear"
                    />{" "}
                    Administrador
                  </button>
                </li>
              )}
              <li className="item logout">
                <button
                  className="open-modal-btn"
                  data-tab="logout"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="fa-solid fa-right-from-bracket"
                  />{" "}
                  Sair
                </button>
              </li>
            </UserMenu>
          </div>
        </div>
      </ChatHeader>

      <ChatMessages ref={messagesEndRef}>
        {/* <div className="message user">Quanto o governo investiu em educação?</div>
                <div className="message assistant">Em 2025, foi investido quantos reais em educação?</div> */}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role}`}
            dangerouslySetInnerHTML={{ __html: msg.content }}
          />
        ))}

        {isLoading && (
          <div className="message assistant loading">Buscando resposta...</div>
        )}
      </ChatMessages>

      {itemType === "alert" ? (
        ""
      ) : (
        <ChatInput>
          <input
            type="text"
            placeholder={
              isLoading ? "Buscando resposta..." : "Digite sua pergunta..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitQuery();
            }}
            disabled={isLoading}
            aria-label="Campo de pergunta"
          />

          <button onClick={submitQuery}>
            <div className="box-send">
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="fa-regular fa-paper-plane"
              />
            </div>
          </button>
        </ChatInput>
      )}
    </ChatContainer>
  );
}
