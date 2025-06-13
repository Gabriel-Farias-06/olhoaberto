"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRightFromBracket,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";

import { useState } from "react";
import {
  SidebarContainer,
  SidebarHeader,
  SidebarChats,
  SidebarFooter,
} from "./styles";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/userLogout";
import { Alert, Conversation } from "@/types/User";
import ModalConfirm from "../Modal/ModalConfirm";

interface SidebarProps {
  isOpen: boolean;
  itemType: "conversation" | "alert";
  toggleSidebar: () => void;
  userName: string;
  items: Conversation[] | Alert[];
  selectedItemId: string | null;
  onSelectItem: (item: any) => void;
  onNewItem: () => void;
}

export default function Sidebar({
  isOpen,
  toggleSidebar,
  userName,
  items,
  selectedItemId,
  onSelectItem,
  onNewItem,
  itemType,
}: SidebarProps) {
  const router = useRouter();
  const { handleLogout } = useLogout();

  const [showConfirmDeleteConversation, setShowConfirmDeleteConversation] =
    useState(false);
  const [conversationToDelete, setConversationToDelete] =
    useState<Conversation | null>(null);

  const handleOpenDeleteModal = (conv: Conversation) => {
    setConversationToDelete(conv);
    setShowConfirmDeleteConversation(true);
  };

  const handleConfirmDeleteConversation = async () => {
    if (!conversationToDelete) return;

    try {
      const res = await fetch(
        `http://localhost:4000/items/${conversationToDelete._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro ao deletar conversa:", errorData.message);
        return;
      }

      console.log("Conversa deletada com sucesso!");
      setShowConfirmDeleteConversation(false);
      setConversationToDelete(null);
      window.location.reload();
    } catch (err) {
      console.error("Erro na requisição de deleção:", err);
    }
  };

  const groupConversationsByDate = (convs: Conversation[]) => {
    const now = new Date();
    const result = {
      Hoje: [] as Conversation[],
      Ontem: [] as Conversation[],
      "Últimos 7 dias": [] as Conversation[],
      "Últimos 30 dias": [] as Conversation[],
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

  const renderConversations = () => {
    if (!items || items.length === 0) {
      return (
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            fontSize: "15px",
          }}
        >
          {itemType === "alert"
            ? "Nenhum alerta cadastrado"
            : "Nenhuma conversa ainda..."}
        </p>
      );
    }

    if (itemType === "alert") {
      return (
        <ul className="conversation-list">
          <ItemBox
            title="Alertas"
            items={items}
            selectedItemId={selectedItemId as string}
            onSelectItem={onSelectItem}
            handleOpenDeleteModal={handleOpenDeleteModal}
          />
        </ul>
      );
    }

    const grouped = groupConversationsByDate(items as Conversation[]);

    return (
      <ul className="conversation-list">
        {Object.entries(grouped).map(([section, convs]) =>
          convs.length > 0 ? (
            <ItemBox
              key={section}
              title={section}
              items={convs}
              selectedItemId={selectedItemId as string}
              onSelectItem={onSelectItem}
              handleOpenDeleteModal={handleOpenDeleteModal}
            />
          ) : null
        )}
      </ul>
    );
  };

  return (
    <>
      <SidebarContainer $isOpen={isOpen}>
        <SidebarHeader>
          <button
            className="mode-open-close"
            aria-label="Alterar modo aberto/fechado"
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon icon={faBars} className="fa-solid fa-bars" />
          </button>

          <button
            aria-label="Criar nova conversa"
            onClick={onNewItem}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <FontAwesomeIcon
              icon={faSquarePlus}
              className="fa-regular fa-square-plus"
            />
          </button>
        </SidebarHeader>

        <SidebarChats>
          <div className="name-user">
            {userName
              ? itemType === "alert"
                ? "Seus alertas"
                : `Bem vindo, ${userName}`
              : "Carregando..."}
          </div>
          <div className="chat-group">{renderConversations()}</div>
        </SidebarChats>

        <SidebarFooter>
          <button className="sidebar-footer-btn" onClick={handleLogout}>
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="fa-solid fa-right-from-bracket"
            />
            <p>Sair</p>
          </button>
        </SidebarFooter>
      </SidebarContainer>

      <ModalConfirm
        isOpen={showConfirmDeleteConversation}
        title="Confirmar exclusão da conversa"
        message={`Tem certeza que deseja excluir a conversa: "${conversationToDelete?.messages[0]?.content.slice(
          0,
          30
        )}..."? Lembrando que esta ação é irreversível e não será possível recuperar a conversa.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDeleteConversation}
        onCancel={() => setShowConfirmDeleteConversation(false)}
      />
    </>
  );
}

// === ItemBox COMPONENT ===
interface ItemBoxProps {
  title: string;
  items: any[];
  selectedItemId: string;
  onSelectItem: (item: any) => void;
  handleOpenDeleteModal: (item: any) => void;
}

const ItemBox: React.FC<ItemBoxProps> = ({
  title,
  items,
  onSelectItem,
  selectedItemId,
  handleOpenDeleteModal,
}) => {
  return (
    <li className="conversation-group" key={title}>
      <p className="conversation-title">{title}</p>
      <ul>
        {items.map((item: any) => (
          <li
            key={item._id}
            className={`conversation-chat${
              item._id === selectedItemId ? " active-conversation" : ""
            }`}
            title={title}
          >
            <span
              onClick={() => onSelectItem(item)}
              style={{ cursor: "pointer" }}
            >
              {"messages" in item && item.messages.length > 0
                ? item.messages[0].content.slice(0, 30) + "..."
                : item.title || "Nova conversa"}
            </span>

            <button
              aria-label="Deletar"
              onClick={() => handleOpenDeleteModal(item)}
              className="conversation-button-delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
};
