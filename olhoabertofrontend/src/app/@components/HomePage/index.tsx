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
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

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
            const res = await fetch(`http://localhost:4000/conversations/${conversation._id}`, {
                credentials: "include"
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Erro ao carregar conversa: ${res.status} - ${errorText}`);
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


    useEffect(() => {
        const fetchConversations = async () => {
            const res = await fetch("http://localhost:4000/conversations", {
                credentials: "include"
            });

            const data = await res.json();
            setConversations(data.conversations);
        };

        fetchConversations();
    }, []);


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
                const { user } = data;

                if (user) {
                    const { _id, email, name, role, conversations } = user;
                    setUser({ _id, email, name, role, conversations });
                } else {
                    router.push('/login');
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
                        conversations={conversations}
                        selectedConversationId={selectedConversationId}
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
                        onConversationCreated={handleConversationCreated}
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
