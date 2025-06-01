import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalOverlayConfirm, ModalContentConfirm, ModalHeaderConfirm, ModalBodyConfirm } from "./styles";

interface ConfirmSaveUserModalProps {
    onClose: () => void;
}

export default function ConfirmSaveUserModal({ onClose }: ConfirmSaveUserModalProps) {

    return (
        <ModalOverlayConfirm>
            <ModalContentConfirm>
                <ModalHeaderConfirm>
                    <h3>Salvar Alterações do Usuário</h3>
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
                        Você está prestes a salvar alterações nas suas configurações de perfil. Isso inclui nome, senha ou os dois. Deseja confirmar essas mudanças?
                    </p>

                    <div className="modal-buttons">
                        <button type="button" className="modal-button cancel" onClick={onClose}>
                            Cancelar</button>
                        <button type="button" className="modal-button save">Salvar</button>
                    </div>

                </ModalBodyConfirm>

            </ModalContentConfirm>
        </ModalOverlayConfirm>
    )
}