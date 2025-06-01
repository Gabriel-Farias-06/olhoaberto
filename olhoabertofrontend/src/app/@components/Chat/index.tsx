"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faRightFromBracket,
    faCircleHalfStroke,
    faGear,
    faUserGear,
    faBell as faBellSolid
} from '@fortawesome/free-solid-svg-icons';
import {
    faBell,
    faCircleUser,
    faPaperPlane
} from '@fortawesome/free-regular-svg-icons';

import { useEffect, useState, useRef } from "react";
import {
    ChatContainer,
    ChatHeader,
    ChatMessages,
    ChatInput,
    UserMenu,
} from "./styles";
import { marked } from "marked";
import { useRouter } from 'next/navigation';
import { Conversation } from '@/types/User';
import { useLogout } from '@/hooks/userLogout';

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

interface ChatProps {
    isOpen: boolean;
    conversations: Conversation[];
    toggleSidebar: () => void;
    openModal: (tab: string) => void;
}

export default function Chat({ isOpen, conversations, toggleSidebar, openModal}: ChatProps) {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [answer, setAnswer] = useState<QueryAnswer>();

    const [messages, setMessages] = useState<Message[]>([]);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLightMode, setIsLightMode] = useState(false);
    const { handleLogout } = useLogout();

    const userMenuRef = useRef<HTMLDivElement>(null);
    const userIconRef = useRef<HTMLDivElement>(null);

    const toggleTheme = () => setIsLightMode((prev) => !prev);
    const toggleUserMenu = () => setShowUserMenu((prev) => !prev);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.currentTarget.value);
    };


    return (
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
                                    <FontAwesomeIcon icon={faBellSolid} className="fa-regular fa-bell" /> Configurar Alertas
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
                    aria-label="Campo de pergunta"
                />

                <button onClick={submitQuery}>
                    <div className="box-send">
                        <FontAwesomeIcon icon={faPaperPlane} className="fa-regular fa-paper-plane" />
                    </div>
                </button>
            </ChatInput>

        </ChatContainer>
    )
}