"use client";

import { Chat, Sidebar, Modal } from "../@components";
import { AppContainer } from "./styles";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Alert, Message } from "@/types/User";
import { axios } from "@/lib";
import { useTheme } from "@/context/ThemeContext";

export default function Alertas() {
  const router = useRouter();

  const { user } = useTheme();
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
      const res = await axios.get(`http://localhost:4040/alerts/${item._id}`);

      if (!res.status) {
        const errorText = res.statusText;
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

      const convertedMessages: Message[] = _selectedAlert.results.map(
        (res) => ({
          role: "assistant",
          content: res.answer,
        })
      );
      setMessages(convertedMessages);

      console.log("Selecionado:", _selectedAlert);
    } catch (err) {
      console.error("Erro ao carregar alerta:", err);
    }
  };

  const fetchAlerts = async () => {
    const res = await axios.get("http://localhost:4040/alerts");
    const data = await res.data;
    setAlerts(data.alerts);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleNewAlert = () => {
    setMessages([]);
    setSelectedAlert(null);
    setIdAlert(null);
  };

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
              initialTab={modalTab}
            />
          )}
        </>
      )}
    </AppContainer>
  );
}
