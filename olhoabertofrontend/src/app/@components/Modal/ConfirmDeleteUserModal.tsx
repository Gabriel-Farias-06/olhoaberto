import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalOverlayConfirm, ModalContentConfirm, ModalHeaderConfirm, ModalBodyConfirm } from "./styles";

interface ConfirmDeleteUserModalProps {
    onClose: () => void;
}

export default function ConfirmDeleteUserModal({ onClose }: ConfirmDeleteUserModalProps) {

    return (
        <ModalOverlayConfirm>
            <ModalContentConfirm>
                <ModalHeaderConfirm>
                    <h3>Deletar Conta</h3>
                    <button onClick={onClose}>
                        <div className="box-xmark">
                            <FontAwesomeIcon
                                icon={faXmark}
                                className="fa-solid fa-xmark"
                            />
                        </div>
                    </button>
                </ModalHeaderConfirm>

                <ModalBodyConfirm>
                    <p>
                        Ao confirmar esta ação, sua conta será permanentemente excluída do sistema, incluindo todas as suas informações e preferências. Esta ação não poderá ser desfeita. Tem certeza de que deseja continuar?
                    </p>

                    <div className="modal-buttons">
                        <button type="button" className="modal-button cancel" onClick={onClose}>
                            Cancelar</button>
                        <button type="button" className="modal-button delet">
                            Excluir</button>
                    </div>
                </ModalBodyConfirm>

            </ModalContentConfirm>
        </ModalOverlayConfirm>
    )
}