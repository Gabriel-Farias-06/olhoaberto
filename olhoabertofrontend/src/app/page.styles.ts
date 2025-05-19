// import styled from "styled-components";

// export const Container = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   width: 100vw;
//   height: 100vh;
// `;

// export const Chat = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 100%;
//   height: 100%;

//   .messages {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     flex-direction: column;
//     padding: 1rem;
//     width: 100%;
//     height: 92%;
//   }

//   .answer {
//     height: 90%;
//     overflow-y: scroll;
//   }
// `;

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

.fa-right-from-bracket {
    font-size: 15px;
    padding-right: 5px;
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
padding: 10px;
padding-bottom: 30px;
background: var(--bg-color);

input {
    flex: 1;
    padding: 10px;
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

item {
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

    i {
        padding-right: 10px;
    }

    .fa-solid {
        color: inherit;
    }

    .fa-regular {
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

fa-solid {
    font-size: 25px;
}

`
export const ModalBody = styled.div`

display: flex;
height: 300px;
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

.tab-content {
    display: none;

    &.hidden {
        display: none;
    }

    &:not(.hidden) {
        display: block;
    }
}



`

