import styled from "styled-components";

export const ModalOverlay = styled.div`

background-color: var(--bg-modal-color);
color: var(--text-color);
position: fixed;
inset: 0;
display: flex;
justify-content: center;
align-items: center;
z-index: 999;

&.hidden {
    display: none;
}

`

export const ModalContent = styled.div`

background-color: var(--bg-color);
border: 3px solid var(--border-chat-color);
border-radius: 30px;
display: flex;
flex-direction: column;
width: 700px;
max-width: 80%;
overflow: hidden;

`

export const ModalHeader = styled.div`

background-color: var(--bg-sidebar-color);
display: flex;
justify-content: space-between;
align-items: center;
padding: 20px 25px;
border-bottom: 2px solid var(--border-chat-color);

button {
    background: none;

    .box-xmark {
        border-radius: 50%;
        padding: 4px 8px;
        transition: background 0.2s;
    
        .fa-solid {
            font-size: 25px;
            color: var(--text-color);
        }
    
        &:hover {
            background: var(--bg-hover-chat-input-color);
        }
    }
}

`
export const ModalBody = styled.div`

display: flex;
height: 400px;
max-height: 60%;
overflow-y: auto;

`
export const ModalSidebar = styled.div`

background-color: var(--bg-sidebar-color);
width: 180px;
padding: 15px 10px;
border-right: 2px solid var(--border-chat-color); 

li  {
    width: 100%;
    height: 100%;

    button {
        background-color: var(--bg-color);
        color: var(--text-color);
        font-size: 15px;
        font-weight: 600; 
        display: block;
        width: 100%;
        padding: 7px 15px;
        margin-bottom: 5px;
        border-radius: 10px;
        border: none;
        text-align: left;
        cursor: pointer;

        .fa-regular, .fa-solid {
            padding-right: 5px  ;
        }

        &.active, &:hover {
            background-color: var(--bg-hover-color);
        }
    }
}

`
export const ModalTabContent = styled.div`

flex: 1;
padding: 20px;
overflow-y: auto;

.tab-content {
    display: none;
    

    &.hidden {
        display: none;
    }

    &:not(.hidden) {
        display: block;
    }


    &#alert {
        .alert-header {
            border-bottom: 2px solid var(--border-login-cadastro-color);
            padding: 0 10px 10px 10px;
        }

        .alert-section {
            display: flex;
            flex-direction: column;
            font-size: 13px;

            .alert-label {
                margin: 20px 0 3px 5px ;
            }

            .alert-input {
                background-color: var(--bg-color);
                color: var(--text-color);
                border: 1px solid var(--border-button-login-cadastro-color);
                border-radius: 10px;
                width: 100%;
                margin: 5px 0 0 0;
                padding: 10px 7px;
                resize: none;
                font-size: 12px;
            }

            .alert-input-wrapper {
                position: relative;
    
                .alert-input {
                    padding-right: 30px;
                }

                .toggle-password {
                    position: absolute;
                    top: 55%;
                    right: 13px;
                    transform: translateY(-50%);
                    cursor: pointer;
                }
            }

            .alert-buttons {
                display: flex;
                justify-content: flex-end;
                padding: 15px 7px 0px 7px;

                .alert-button {
                    margin-left: 7px;
                    border-radius: 16px;
                    cursor: pointer;
                    transition-duration: 0.2s;

                    &.cancel {
                        background-color: var(--bg-modal-input-cancel-color);
                        border: 1px solid var(--border-button-login-cadastro-color);
                        color: var(--text-color);
                        padding: 5px 7px;
                    }

                    &.create {
                        background-color: var(--bg-button-login-cadastro-color);
                        color: var(--text-second-color);
                        padding: 5px 13px;
                    }

                    &:hover {
                        background-color: var(--text-color);
                        color: var(--bg-color);
                    }

                }
            }

                .alert-footer.active {
                    background-color: var(--bg-alert-color);
                    color: var(--text-alert-color);
                    margin:  0 30px 20px 30px;
                    padding: 7px;
                    border-radius: 7px;
                    display: flex;
                    align-items: center;
                }

        }
    }


    &#profile {
        .profile-header {
            border-bottom: 2px solid var(--border-login-cadastro-color);
            padding: 0 10px 10px 10px;
        }

        .profile-section {
            display: flex;
            flex-direction: column;
            font-size: 13px;

            .profile-label {
                margin: 20px 0 3px 5px ;
            }

            .profile-input {
                background-color: var(--bg-color);
                color: var(--text-color);
                border: 1px solid var(--border-button-login-cadastro-color);
                border-radius: 10px;
                width: 100%;
                margin: 5px 0 0 0;
                padding: 10px 7px;
            }

            .profile-input-wrapper {
                position: relative;
    
                .profile-input {
                    padding-right: 30px;
                }

                .toggle-password {
                    position: absolute;
                    top: 55%;
                    right: 13px;
                    transform: translateY(-50%);
                    cursor: pointer;
                }
            }

            .profile-checkbox {
                display: flex;
                align-items: center;
                margin: 10px 5px 0 5px; 

                input {
                    appearance: none;
                    position: relative;
                    background-color: transparent;
                    border: 2px solid var(--border-color);
                    border-radius: 4px;
                    margin-right: 5px;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }

                input[type="checkbox"]:checked {
                    background-color: var(--border-color);
                }
                
                input[type="checkbox"]:checked::after {
                    content: "✔";
                    color: white;
                    font-size: 12px;
                    position: absolute;
                    top: -2px;
                    left: 1px;
                }

            }

            .profile-buttons {
                display: flex;
                justify-content: flex-end;
                padding: 15px 7px 0px 7px;

                .profile-button {
                    margin-left: 7px;
                    border-radius: 16px;
                    cursor: pointer;
                    transition-duration: 0.2s;

                    &.cancel {
                        background-color: var(--bg-modal-input-cancel-color);
                        border: 1px solid var(--border-button-login-cadastro-color);
                        color: var(--text-color);
                        padding: 5px 7px;
                    }

                    &.save {
                        background-color: var(--bg-button-login-cadastro-color);
                        color: var(--bg-color);
                        padding: 5px 13px;
                    }

                    &:hover {
                        background-color: var(--text-color);
                        color: var(--bg-color);
                    }

                }
            }

                .profile-footer.active {
                    background-color: var(--bg-alert-color);
                    color: var(--text-alert-color);
                    margin:  0 30px 20px 30px;
                    padding: 7px;
                    border-radius: 7px;
                    display: flex;
                    align-items: center;
                }
        }

        .profile-delet {
            display: flex;
            justify-content: space-between;
            border-top: 2px solid var(--border-login-cadastro-color);
            margin: 30px 0;
            padding-top: 20px;

            .profile-button-delet {
                background-color: var(--bg-profile-user-delet);
                color: white;
                font-weight: bold;
                margin-left: 7px;
                padding: 0 7px;
                border-radius: 16px;
                cursor: pointer;
                transition-duration: 0.2s;

                &:hover {
                    background-color: var(--bg-profile-user-delet-hover);
                }
            }


        }

    }


    &#admin {
        .admin-header {
            border-bottom: 2px solid var(--border-login-cadastro-color);
            padding: 0 10px 10px 10px;
        }

        .admin-section {
            display: flex;
            flex-direction: column;
            font-size: 13px;

            .admin-label {
                margin: 20px 0 3px 5px ;
            }

            .admin-input {
                background-color: var(--bg-color);
                color: var(--text-color);
                border: 1px solid var(--border-button-login-cadastro-color);
                border-radius: 10px;
                width: 100%;
                margin: 5px 0 0 0;
                padding: 10px 7px;
                resize: none;
                font-size: 12px;
            }

            .admin-input-wrapper {
                position: relative;
    
                .admin-input {
                    padding-right: 30px;
                }

                .toggle-password {
                    position: absolute;
                    top: 55%;
                    right: 13px;
                    transform: translateY(-50%);
                    cursor: pointer;
                }
            }

            .admin-buttons {
                display: flex;
                justify-content: flex-end;
                padding: 15px 7px 0px 7px;

                .admin-button {
                    margin-left: 7px;
                    border-radius: 16px;
                    cursor: pointer;
                    transition-duration: 0.2s;

                    &.cancel {
                        background-color: var(--bg-modal-input-cancel-color);
                        border: 1px solid var(--border-button-login-cadastro-color);
                        color: var(--text-color);
                        padding: 5px 7px;
                    }

                    &.save {
                        background-color: var(--bg-button-login-cadastro-color);
                        color: var(--text-second-color);
                        padding: 5px 13px;
                    }

                    &:hover {
                        background-color: var(--text-color);
                        color: var(--bg-color);
                    }

                }
            }

                .admin-footer.active {
                    background-color: var(--bg-alert-color);
                    color: var(--text-alert-color);
                    margin:  0 30px 20px 30px;
                    padding: 7px;
                    border-radius: 7px;
                    display: flex;
                    align-items: center;
                }

        }
    }
}


`




export const ModalOverlayConfirm = styled.div`
background-color: var(--bg-modal-color);
color: var(--text-color);
position: fixed;
inset: 0;
display: flex;
justify-content: center;
align-items: center;
z-index: 999;

&.hidden {
    display: none;
}
`

export const ModalContentConfirm = styled.div`
background-color: var(--bg-color);
border: 3px solid var(--border-chat-color);
border-radius: 30px;
display: flex;
flex-direction: column;
width: 450px;
max-width: 70%;
overflow: hidden;
`

export const ModalHeaderConfirm = styled.div`

background-color: var(--bg-sidebar-color);
display: flex;
justify-content: space-between;
align-items: center;
padding: 15px 20px 10px 20px;
border-bottom: 2px solid var(--border-chat-color);

button {
    background: none;
    
    .box-xmark {
        border-radius: 50%;
        padding: 2px 6px;
        transition: background 0.2s;
    
        .fa-solid {
            font-size: 20px;
            color: var(--text-color);
        }
    
        &:hover {
            background: var(--bg-hover-chat-input-color);
        }
    }
}

`
export const ModalBodyConfirm = styled.div`

display: flex;
flex-direction: column;
height: 130px;
max-height: 60%;
padding: 15px 20px; 
font-size: 13px;
hyphens: auto;
overflow-y: hidden;

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    margin: 20px 7px;

    .modal-button {
        margin-left: 7px;
        border-radius: 16px;
        cursor: pointer;
        transition-duration: 0.2s;

        &.cancel {
            background-color: var(--bg-modal-input-cancel-color);
            border: 1px solid var(--border-button-login-cadastro-color);
            color: var(--text-color);
            padding: 5px 7px;
        }

        &.save {
            background-color: var(--bg-button-login-cadastro-color);
            color: var(--text-second-color);
            padding: 5px 13px;
        }

        &.delet {
            background-color: var(--bg-profile-user-delet);
            color: var(--text-color);
            font-weight: bold;
            margin-left: 7px;
            padding: 0 7px;
            border-radius: 16px;
            cursor: pointer;
            transition-duration: 0.2s;

            &:hover {
                background-color: var(--bg-profile-user-delet-hover);
                color: var(--text-color);
            }
        }

        &:hover {
            background-color: var(--text-color);
            color: var(--bg-color);
        }

    }
}
`