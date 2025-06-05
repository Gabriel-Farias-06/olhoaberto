"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import {
  faSquarePlus
} from '@fortawesome/free-regular-svg-icons';

import { useEffect, useState, useRef } from "react";
import {
  SidebarContainer,
  SidebarHeader,
  SidebarChats,
  SidebarFooter,
} from "./styles";
import { marked } from "marked";
import { useRouter } from 'next/navigation';
import { useLogout } from '@/hooks/userLogout';
import { Conversation } from '@/types/User';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userName: string;
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
}


export default function Sidebar({
  isOpen, toggleSidebar, userName, conversations,
  selectedConversationId, onSelectConversation, onNewConversation
}: SidebarProps) {

  const router = useRouter();
  const { handleLogout } = useLogout();

  const renderConversations = () => {
    if (!conversations || conversations.length === 0) {
      return <p>Nenhuma conversa encontrada.</p>;
    }

    const grouped = groupConversationsByDate(conversations);

    return (
      <ul className="conversation-list">
        {Object.entries(grouped).map(([section, convs]) =>
          convs.length > 0 ? (
            <li className="conversation-group" key={section}>
              <p className={`conversation-title`}>{section}</p>
              <ul>
                {convs.map((conv) => (
                  <li
                    key={conv._id}
                    onClick={() => onSelectConversation(conv)}
                    className={`conversation-chat${conv._id === selectedConversationId ? " active-conversation" : ""}`} 
                    title={conv.messages.length > 0 ? conv.messages[0].content : "Sem mensagens"}
                  >
                    {conv.messages.length > 0
                      ? conv.messages[0].content.slice(0, 30) + "..."
                      : "Nova conversa"}
                  </li>
                ))}
              </ul>
            </li>
          ) : null
        )}
      </ul>
    );
  };


  const groupConversationsByDate = (convs: Conversation[]) => {
    const today: Record<string, Conversation[]> = {};
    const yesterday: Record<string, Conversation[]> = {};
    const last7Days: Record<string, Conversation[]> = {};
    const last30Days: Record<string, Conversation[]> = {};

    const now = new Date();
    const result = {
      Hoje: [] as Conversation[],
      Ontem: [] as Conversation[],
      "Últimos 7 dias": [] as Conversation[],
      "Últimos 30 dias": [] as Conversation[]
    };

    convs.forEach((conv) => {
      const startedAt = new Date(conv.startedAt);
      const diffInMs = now.getTime() - startedAt.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) result.Hoje.push(conv);
      else if (diffInDays === 1) result.Ontem.push(conv);
      else if (diffInDays <= 7) result["Últimos 7 dias"].push(conv);
      else if (diffInDays <= 30) result["Últimos 30 dias"].push(conv);
    });

    return result;
  };


  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarHeader>
        <button className="mode-open-close" aria-label="Alterar modo aberto/fechado" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} className="fa-solid fa-bars" />
        </button>

        <button
          aria-label="Criar nova conversa"
          onClick={onNewConversation}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faSquarePlus} className="fa-regular fa-square-plus" />
        </button>

      </SidebarHeader>
      <SidebarChats>
        <div className="name-user">
          {userName ? `Bem vindo, ${userName}` : "Carregando..."}
        </div>
        <div className="chat-group">
          {/* <p>Conversas</p> */}
          {renderConversations()}
        </div>
      </SidebarChats>
      <SidebarFooter>
        <button className="sidebar-footer-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} className="fa-solid fa-right-from-bracket" />
          <p>Sair</p>
        </button>
      </SidebarFooter>
    </SidebarContainer>
  );
};