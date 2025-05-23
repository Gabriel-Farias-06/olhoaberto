
import styled from "styled-components";

export const AppContainer = styled.div`

background-color: var(--bg-color);
color: var(--text-color);
display: flex;
height: 100vh;

.fa-regular, .fa-solid {
    color: var(--text-color);
    cursor: pointer;
}

.fa-regular:hover, .fa-solid:hover {
    transition: 0.1s;
    color: var(--text-hover-color);
}

`
export const Sidebar = styled.div`

display: flex;
flex-direction: column;
width: 350px;
height: 100vh;
background-color: var(--bg-sidebar-color);
padding: 25px 35px;
`
export const SidebarHeader = styled.div`

display: flex;
justify-content: space-between;
align-items: center;
padding-bottom: 15px;
font-size: 25px;

`
export const SidebarChats = styled.div`
padding: 15px 0px;
overflow-y: auto;

.name-user {
    padding: 0px 5px;
    font-size: 20px;
    font-weight: bold;
}

.chat-group {
    padding: 15px 5px 7px 5px;
    margin-bottom: 5px;
    border-bottom: 2px solid var(--border-color);

    p {
        padding-bottom: 7px;
        font-size: 20px;
        font-weight: bold;  
    }

    .conversation-list {
        flex: 1;
        overflow-y: auto;

        li {
            padding: 5px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    } 
}

`
export const SidebarFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: auto;
  padding-top: 20px;
  font-size: 17px;
  font-weight: bold;

  .sidebar-footer-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-color);
    font: inherit;
    padding: 0;
    transition: color 0.1s ease;

    &:hover {
      color: var(--text-hover-color);
    }

    .fa-right-from-bracket {
      font-size: 15px;
      padding-right: 5px;
      color: inherit; /* para herdar a cor do botão */
    }
  }
`


export const ChatContainer = styled.div`

flex: 1;
display: flex;
flex-direction: column;

`
export const ChatHeader = styled.div`

display: flex;
justify-content: space-between;
align-items: center;
padding: 25px 15px;
background: var(--bg-color);
font-size: 25px;

.box-right {
    display: flex;
    flex-direction: row;

    .mode-dark-light {
        all: unset;
        margin-right: 20px;
    }
}

`
export const ChatMessages = styled.div`

display: flex;
flex-direction: column;
flex: 1;
padding: 20px;
overflow-y: auto;
background: var(--bg-chat-messages-color);

.message {
    margin-bottom: 10px;
    padding: 10px 15px;
    max-width: 60%;
    border-radius: 7px;

    &.user {
        background: var(--bg-message-user-color);
        align-self: flex-end;
    }

    &.bot {
        background: var(--bg-message-bot-color);
        align-self: flex-start;
    }
}

`

export const ChatInput = styled.div`

display: flex;
padding: 20px 80px 30px 80px;
background: var(--bg-color);

input {
    flex: 1;
    padding: 10px 15px;
    border-radius: 15px 0 0 15px;
    background-color: var(--bg-input-and-button-color);
    color: var(--text-color);
}

button {
    padding: 10px 15px 12px 15px;
    background: var(--bg-input-and-button-color);
    border: none;
    border-radius: 0 15px 15px 0;
    cursor: pointer;

    .bi-send {
        font-size: 15px;
    }
}

`

export const UserMenu = styled.div`

background-color: var(--bg-color);
border: 2px solid var(--border-color);
border-radius: 16px;
padding: 10px;
position: absolute;
top: 55px;
right: 20px;
z-index: 1000;

.item {
    font-size: 0;
    padding: 7px 3px;
    border-bottom: 2px solid var(--border-chat-color);

    &.alert {
        padding-top: 0;
        border-bottom: 2px solid var(--border-chat-color);
    }

    &.logout {
        padding-bottom: 0;
        border-bottom: 0;
    }
}

.open-modal-btn {
    display: flex;
    align-items: center;
    background-color: var(--bg-color);
    color: var(--text-color);
    cursor: pointer;

    .fa-solid, .fa-regular  {
        padding-right: 10px;
        color: inherit;
    }

    &:hover {
        transition: 0.1s;
        color: var(--text-hover-color);
    }
}

`
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

.fa-solid {
    font-size: 25px;
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
                        background-color: var(--bg-color);
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
    }
}


`
