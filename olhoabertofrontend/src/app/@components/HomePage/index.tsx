"use client";

import Chat from '../Chat';
import Sidebar from '../Sidebar';
import Modal from '../Modal';
import { AppContainer } from "./styles";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { UserData } from '@/types/User';
import type { Conversation, Message } from '@/types/User';

export default function HomePage() {
    const router = useRouter();

    const [user, setUser] = useState<UserData | null>(null)
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [modalTab, setModalTab] = useState<"alert" | "profile" | "admin">("alert");

    const [idConversation, setIdConversation] = useState<string | null>(null);
    const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    
    const toggleSidebar = () => setIsOpen(!isOpen);

    const openModal = (tab: "alert" | "profile" | "admin") => {
        setModalTab(tab);
        setShowModal(true);
    };

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        setIdConversation(conversation._id);
        setMessages(conversation.messages);
    };

    const handleNewConversation = () => {
        setMessages([]);
        setSelectedConversation(null);
        setIdConversation(null);
    }

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch("http://localhost:4000/me", {
                    credentials: "include",
                });

                const data = await res.json();
                console.log('Status da resposta:', data);

                if (!res.ok) {
                    router.push("/login");
                } else {
                    const { name, email, _id, role, conversations } = data.user;
                    setUser({ name, email, _id, role, conversations })
                }
            } catch (err) {
                console.error("Erro ao verificar autenticação: ", err)
                router.push("/login")
            }
        }
        checkAuth();
    }, [router]);

    return (
        <AppContainer>
            {user && (
                <>
                    <Sidebar
                        isOpen={isOpen}
                        toggleSidebar={toggleSidebar}
                        userName={user.name}
                        conversations={user.conversations}
                        onSelectConversation={handleSelectConversation}
                        onNewConversation={handleNewConversation}
                    />
                    <Chat
                        isOpen={isOpen}
                        toggleSidebar={toggleSidebar}
                        user={user}
                        openModal={openModal}
                        idConversation={idConversation}
                        setIdConversation={setIdConversation}
                        selectedConversation={selectedConversation}
                        setMessages={setMessages}
                        messages={messages}
                    />
                    {showModal && (
                        <Modal
                            closeModal={() => setShowModal(false)}
                            user={user}
                            setUser={setUser}
                            initialTab={modalTab}
                        />
                    )}
                </>
            )}
        </AppContainer>
    );
}
