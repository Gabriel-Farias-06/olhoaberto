import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalOverlayConfirm, ModalContentConfirm, ModalHeaderConfirm, ModalBodyConfirm } from "./styles";

interface ConfirmSaveAdminModalProps {
    onClose: () => void;
}

export default function ConfirmSaveAdminModal({ onClose }: ConfirmSaveAdminModalProps) {

    return (
        <ModalOverlayConfirm>
            <ModalContentConfirm>
                <ModalHeaderConfirm>
                    <h3>Salvar Configurações Administrativas</h3>
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
                        Ao confirmar, as configurações do modelo de IA (como temperatura, número máximo de tokens, top-k e top-p, instruções) serão atualizadas para todos os usuários. Tem certeza de que deseja aplicar essas alterações?
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