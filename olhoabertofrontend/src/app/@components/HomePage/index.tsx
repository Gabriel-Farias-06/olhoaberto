"use client";

import Chat from '../Chat';
import Sidebar from '../Sidebar';
import Modal from '../Modal';
import { AppContainer } from "./styles";

import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { UserData } from '@/types/User';

export default function HomePage() {
    const router = useRouter();

    const [user, setUser] = useState<UserData | null>(null)
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [modalTab, setModalTab] = useState<"alert" | "profile" | "admin">("alert");

    const toggleSidebar = () => setIsOpen(!isOpen);

    const openModal = (tab: "alert" | "profile" | "admin") => {
        setModalTab(tab);
        setShowModal(true);
    };


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
                    const { name, email, role, conversations } = data.user;
                    setUser({ name, email, role, conversations })
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
                    />
                    <Chat
                        isOpen={isOpen}
                        toggleSidebar={toggleSidebar}
                        conversations={user.conversations}
                        openModal={openModal}
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
