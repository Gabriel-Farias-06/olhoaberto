import styled from "styled-components";

export const AppContainer = styled.div`
  background-color: var(--bg-color);
  color: var(--text-color);
  display: flex;
  height: 100vh;

  .fa-regular,
  .fa-solid {
    color: var(--text-color);
    cursor: pointer;
  }

  .fa-regular:hover,
  .fa-solid:hover {
    transition: 0.1s;
    color: var(--text-hover-color);
  }
`;

export const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

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
`;

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
`;
