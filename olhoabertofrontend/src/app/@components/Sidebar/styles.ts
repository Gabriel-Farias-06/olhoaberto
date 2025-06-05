import styled from "styled-components";

interface SidebarProps {
  $isOpen: boolean;
}

export const SidebarContainer = styled.div<SidebarProps>`
  display: flex;
  flex-direction: column;
  width: ${props => (props.$isOpen ? '300px' : '0px')};
  min-width: ${props => (props.$isOpen ? '250px' : '0px')};
  height: 100vh;
  background-color: var(--bg-sidebar-color);
  padding: ${props => (props.$isOpen ? '25px 35px' : '0px')}; 
  overflow-x: hidden; 
  transition: width 0.3s ease-in, padding 0.3s ease-in, opacity 0.3s ease-in;
  opacity: ${props => (props.$isOpen ? '1' : '0')};
`;

export const SidebarHeader = styled.div`

display: flex;
justify-content: space-between;
align-items: center;
padding-bottom: 15px;
font-size: 25px;

.mode-open-close {
    all: unset;
    margin-right: 20px;
}

.fa-square-plus {
  font-size: 25px;
}



`

export const SidebarChats = styled.div`
padding: 15px 0px;
overflow-y: auto;

.name-user {
    padding: 5px 5px;
    font-size: 20px;
    font-weight: bold;
}

.chat-group {
    padding: 7px 0px;
    margin-bottom: 5px;

    .conversation-group {
      margin-bottom: 20px;
      border-bottom: 2px solid var(--border-color);
    }

    .conversation-list {
        flex: 1;
        overflow-y: auto;

        li {
          padding: 5px 0px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-title {
          font-size: 15px;
          font-weight: bold;
          padding: 5px 7px;
        }

        .conversation-chat {
          padding: 6px 7px;
          margin-bottom: 1px;
          border-radius: 9px;
          transition: 0.1s;
          cursor: pointer;

          &:hover{
            background-color: var(--border-color);
          }
        }

        .active-conversation {
          background-color: var(--border-color);
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
