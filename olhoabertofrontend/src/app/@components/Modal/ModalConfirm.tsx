"use client";

import React from "react";
import {
    ModalOverlayConfirm,
    ModalContentConfirm,
    ModalHeaderConfirm,
    ModalBodyConfirm
} from "./styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ModalConfirmProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}


export default function ModalConfirm({
    isOpen,
    title = "Confirmação",
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
}: ModalConfirmProps) {
    if (!isOpen) return null;

    return (
        <ModalOverlayConfirm>
            <ModalContentConfirm>
                <ModalHeaderConfirm>
                    <h3>{title}</h3>

                    <button onClick={onCancel} aria-label="Fechar modal">
                        <div className="box-xmark">
                            <FontAwesomeIcon
                                icon={faXmark}
                                className="fa-solid fa-xmark"
                            />
                        </div>
                    </button>
                </ModalHeaderConfirm>

                <ModalBodyConfirm>
                    <p>{message}</p>

                    <div className="modal-buttons">
                        <button type="button" className="modal-button cancel" onClick={onCancel}>
                            {cancelText}</button>
                        <button type="button" className="modal-button save" onClick={onConfirm}>{confirmText}</button>
                    </div>
                </ModalBodyConfirm>
            </ModalContentConfirm>
        </ModalOverlayConfirm>
    );
}
