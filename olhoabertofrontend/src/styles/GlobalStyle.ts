// styles/GlobalStyle.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
      --bg-color: #0C0C0C;
      --bg-modal-color: #0c0c0c7e;
      --text-color: #fff;
      --text-second-color: #000;
      --bg-alert-color: rgb(255, 0, 0, 0.2);
      --bg-sidebar-color: #090909;
      --border-color: #333;
      --bg-chat-messages-color: #0C0C0C;
      --bg-message-user-color: #191919; 
      --bg-message-bot-color: #191919; 
      --bg-input-and-button-color: #191919;
      --bg-login-cadastro-color: #1a1a1a;
      --bg-button-login-cadastro-color: #B8B8B8;
      --border-button-login-cadastro-color: #3D3D3D;
      --border-login-cadastro-color: #292929;
      --border-chat-color: #292929;
      --bg-hover-color: #222222;
      --text-hover-color: #9b9b9b;
      --text-href-color: #B8B8B8;
      --bg-alert-sucess-color: #d4edda;
      --text-alert-sucess-color: #155724;
      --bg-alert-error-color: #f8d7da;
      --text-alert-error-color: #721c24;
      --bg-profile-user-delet: #fc5b5b;
      --bg-profile-user-delet-hover: #fc1e1e;
      --bg-chat-input-color: #2a2a2a;
      --bg-hover-chat-input-color: #3a3a3a;
      --bg-modal-input-cancel-color: #2a2a2a;
  }

  :root.light {
      --bg-color: #fff;
      --bg-modal-color: #ffffffcc;
      --text-color: #000;
      --text-second-color: #666;
      --bg-alert-color: rgba(255, 0, 0, 0.1);
      --bg-sidebar-color: #ffffff;
      --border-color: #ccc;
      --bg-chat-messages-color: #f5f5f5;
      --bg-message-user-color: #eaeaea; 
      --bg-message-bot-color: #eaeaea; 
      --bg-input-and-button-color: #ffffff;
      --bg-login-cadastro-color: #ffffff;
      --bg-button-login-cadastro-color: #333333;
      --border-button-login-cadastro-color: #dddddd;
      --border-login-cadastro-color: #cccccc;
      --border-chat-color: #cccccc;
      --bg-hover-color: #e0e0e0;
      --text-hover-color: #333333;
      --text-href-color: #007bff;
      --bg-alert-sucess-color: #d4edda;
      --text-alert-sucess-color: #155724;
      --bg-alert-error-color: #f8d7da;
      --text-alert-error-color: #721c24;
      --bg-chat-input-color: #e0e0e0;
      --bg-hover-chat-input-color: #d5d5d5;
  } 

  *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Roboto', sans-serif;
      border: none;
      text-decoration: none;
      outline: none;
      word-break: keep-all;
      list-style: none;
  }

  button {
    cursor: pointer;
  }

  .hidden {
    display: none;
  }
`;

export default GlobalStyle;
