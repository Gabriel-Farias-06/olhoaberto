import styled from "styled-components";

export const ChatContainer = styled.div`

flex: 1;
display: flex;
flex-direction: column;

`

export const ChatHeader = styled.div`

display: flex;
justify-content: space-between;
align-items: center;
padding: 25px 20px;
background: var(--bg-color);
font-size: 25px;

.box-left {
    display: flex;
    flex-direction: row;

    .mode-open-close {
        all: unset;
        margin-right: 20px;
    }

    .notify-icon {
        transition: transform 0.3s ease, color 0.3s ease, opacity 0.3s ease;
    }
}

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
word-break: keep-all;
hyphens: auto;
overflow-y: auto;
background: var(--bg-chat-messages-color);

.message {
    margin-bottom: 10px;
    padding: 10px 15px;
    max-width: 600px;
    border-radius: 7px;

    &.user {
        background: var(--bg-message-user-color);
        align-self: flex-end;
    }

    &.assistant {
        word-break: keep-all;
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
    border: none;
    outline: none;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

button {
    background-color: var(--bg-input-and-button-color);
    border: none;
    border-radius: 0 15px 15px 0;
    cursor: pointer;
    padding: 0 10px 0 15px;
    display: flex;
    align-items: center;
    justify-content: center;

    .box-send {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-chat-input-color);
        border-radius: 50%;
        padding: 8px;
        transition: background 0.2s;

        .fa-paper-plane {
            font-size: 15px;
            color: var(--text-color);
        }

        &:hover {
            background: var(--bg-hover-chat-input-color);
        }
    }
}
`;


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

