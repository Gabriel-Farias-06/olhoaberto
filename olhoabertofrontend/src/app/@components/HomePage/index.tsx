"use client";

import Chat from "../Chat";
import Sidebar from "../Sidebar";
import Modal from "../Modal";
import { AppContainer } from "./styles";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserData } from "@/types/User";
import type { Conversation, Message } from "@/types/User";
import { useTheme } from "@/context/ThemeContext";

export default function HomePage() {
  const router = useRouter();
  const { user } = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [modalTab, setModalTab] = useState<"alert" | "profile" | "admin">(
    "alert"
  );

  const [idConversation, setIdConversation] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(
    user.conversations
  );
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    setConversations(user.conversations);
  }, [user]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const openModal = (tab: "alert" | "profile" | "admin") => {
    setModalTab(tab);
    setShowModal(true);
  };

  const handleConversationCreated = async (newConv: Conversation) => {
    setIdConversation(newConv._id);
    setSelectedConversation(newConv);
    setConversations((prev) => [...prev, newConv]);
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    try {
      const res = await fetch(
        `http://localhost:4040/conversations/${conversation._id}`,
        {}
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Erro ao carregar conversa: ${res.status} - ${errorText}`
        );
      }

      const fullConversation = await res.json();

      setSelectedConversation(fullConversation.conversation);
      setIdConversation(fullConversation.conversation._id);
      setMessages(fullConversation.conversation.messages);
      setSelectedConversationId(conversation._id);
    } catch (err) {
      console.error("Erro ao carregar conversa completa:", err);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setSelectedConversation(null);
    setIdConversation(null);
  };

  return (
    <AppContainer>
      {user && (
        <>
          <Sidebar
            itemType="conversation"
            isOpen={isOpen}
            toggleSidebar={toggleSidebar}
            userName={user.name}
            items={conversations}
            selectedItemId={selectedConversationId}
            onSelectItem={handleSelectConversation}
            onNewItem={handleNewConversation}
          />

          <Chat
            itemType="conversation"
            isOpen={isOpen}
            toggleSidebar={toggleSidebar}
            user={user}
            openModal={openModal}
            idItem={idConversation}
            setIdItem={setIdConversation}
            selectedItem={selectedConversation}
            setMessages={setMessages}
            messages={messages}
            onItemCreated={handleConversationCreated}
          />

          {showModal && (
            <Modal
              closeModal={() => setShowModal(false)}
              initialTab={modalTab}
            />
          )}
        </>
      )}
    </AppContainer>
  );
}
