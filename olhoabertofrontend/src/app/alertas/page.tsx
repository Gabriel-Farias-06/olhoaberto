"use client";

import { Chat, Sidebar, Modal } from "../@components";
import { AppContainer } from "./styles";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserData } from "@/types/User";
import type { Alert, Message } from "@/types/User";

export default function Alertas() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [modalTab, setModalTab] = useState<"alert" | "profile" | "admin">(
    "alert"
  );

  const [idAlert, setIdAlert] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const openModal = (tab: "alert" | "profile" | "admin") => {
    setModalTab(tab);
    setShowModal(true);
  };

  const handleAlertCreated = async (newConv: Alert) => {
    setIdAlert(newConv._id);
    setSelectedAlert(newConv);
    setAlerts((prev) => [...prev, newConv]);
  };

  const handleSelectAlert = async (item: Alert) => {
    try {
      const res = await fetch(`http://localhost:4000/alerts/${item._id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Erro ao carregar alerta: ${res.status} - ${errorText}`
        );
      }

      const _selectedAlert = alerts.find((alert) => alert._id === item._id);
      if (!_selectedAlert) {
        throw new Error("ID do alerta não encontrado.");
      }

      setSelectedAlert(_selectedAlert);
      setIdAlert(_selectedAlert._id);
      setSelectedAlertId(_selectedAlert._id);

      const convertedMessages: Message[] = _selectedAlert.results.map((res) => ({
        role: "assistant",
        content: res.answer,
      }));
      setMessages(convertedMessages);

      console.log("Selecionado:", _selectedAlert);
    } catch (err) {
      console.error("Erro ao carregar alerta:", err);
    }
  };


  useEffect(() => {
    const fetchAlerts = async () => {
      const res = await fetch("http://localhost:4000/alerts", {
        credentials: "include",
      });

      const data = await res.json();

      setAlerts(data.alerts);
    };

    fetchAlerts();
  }, []);

  const handleNewAlert = () => {
    setMessages([]);
    setSelectedAlert(null);
    setIdAlert(null);
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:4000/me", {
          credentials: "include",
        });

        const data = await res.json();
        console.log("Status da resposta:", data);
        const { user } = data;

        if (user) {
          const { _id, email, name, role, conversations } = user;
          setUser({ _id, email, name, role, conversations });
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação: ", err);
        router.push("/login");
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
            items={alerts}
            itemType="alert"
            selectedItemId={selectedAlertId}
            onSelectItem={handleSelectAlert}
            onNewItem={handleNewAlert}
            openModal={openModal}
          />

          <Chat
            isOpen={isOpen}
            toggleSidebar={toggleSidebar}
            user={user}
            openModal={openModal}
            idItem={idAlert}
            setIdItem={setIdAlert}
            selectedItem={selectedAlert}
            setMessages={setMessages}
            messages={messages}
            onItemCreated={handleAlertCreated}
            itemType="alert"
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
