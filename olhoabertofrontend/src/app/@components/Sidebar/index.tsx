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
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
}

export default function Sidebar({ 
  isOpen, toggleSidebar, userName, 
  conversations, onSelectConversation, onNewConversation
}: SidebarProps) {

  const router = useRouter();
  const { handleLogout } = useLogout();

  return (
    <SidebarContainer $isOpen={isOpen}>
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
    </SidebarContainer>
  );
};