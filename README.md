
# Olho Aberto

> Plataforma para consulta inteligente e colaborativa de dados públicos do Diário Oficial da União e Portal da Transparência, usando backend Node.js com integração a LLMs e frontend Next.js.

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)  
- [Objetivos do Projeto](#objetivos-do-projeto)  
- [Funcionalidades](#funcionalidades)  
- [Tecnologias](#tecnologias)  
- [Estrutura do Projeto](#estrutura-do-projeto)  
- [Pré-requisitos](#pré-requisitos)  
- [Configuração das Variáveis de Ambiente](#configuração-das-variáveis-de-ambiente)  
- [Como Rodar](#como-rodar)  
  - [Rodar com Docker (Online)](#rodar-com-docker-online)  
  - [Rodar Localmente (Sem Docker)](#rodar-localmente-sem-docker)  
- [Acessando a Aplicação](#acessando-a-aplicação)  
- [Parando o Projeto](#parando-o-projeto)  
- [Observação](#observação)  
- [Contribuindo](#contribuindo)  
- [Licença](#licença)

---

## Sobre o Projeto

O **Olho Aberto** é um sistema web desenvolvido para permitir a consulta inteligente e colaborativa de dados públicos extraídos do Diário Oficial da União e do Portal da Transparência. Por meio de uma interface moderna e intuitiva, o sistema oferece busca semântica com apoio de modelos de linguagem (LLMs), trazendo respostas rápidas e contextualizadas para os usuários.

---

## Objetivos do Projeto

- Facilitar o acesso e a consulta a informações públicas oficiais  
- Oferecer buscas inteligentes com linguagem natural e contextualização  
- Integrar backend robusto para coleta, armazenamento e busca dos dados  
- Disponibilizar frontend responsivo para interação simples e eficaz  
- Usar tecnologias modernas como Docker e Ngrok para facilitar o desenvolvimento e deploy  

---

## Funcionalidades

- Coleta automatizada de dados públicos via scraping
- Busca vetorial semântica com modelos de linguagem avançados  
- Autenticação e controle de usuários  
- Interface web com chat, alertas e histórico de conversas  
- Exposição da aplicação local na internet via túnel Ngrok  
- Deploy via Docker Compose para facilidade de execução  

---

## Tecnologias

- **Backend:** Node.js, TypeScript, Express, MongoDB  
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS  
- **LLM (IA):** Gemini (Google)
- **Vetorização:** MongoDB Atlas Search
- **Banco de Dados:** MongoDB
- **Infraestrutura:** Docker, Docker Compose, Ngrok  

---

## Estrutura do Projeto

```
.
├── .env                  # Variáveis de ambiente globais, ex: NGROK_AUTHTOKEN
├── docker-compose.yml    # Configuração do Docker Compose
├── olhoabertobackend/
│   └── dataSearcher/
│       ├── Dockerfile
│       ├── .env          # Variáveis de ambiente específicas do backend
│       └── ...
├── olhoabertofrontend/
│   ├── Dockerfile
│   └── ...
└── README.md             # Este arquivo
```

---

## Pré-requisitos

Antes de rodar o projeto, certifique-se de ter:

- **Docker Desktop** instalado (inclui Docker Engine e Docker Compose)  
  [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)  

- **Ngrok Auth Token** para exposição pública do frontend  
  [Cadastro Ngrok](https://ngrok.com/signup)  
  [Obtenha seu Ngrok Auth Token](https://dashboard.ngrok.com/get-started/your-authtoken)  

- **Node.js e npm** (para rodar localmente sem Docker)

---

## Configuração das Variáveis de Ambiente

Copie os arquivos `.example-env` para `.env` e preencha as variáveis conforme necessário.

- Na raiz do projeto (onde está o `docker-compose.yml`), crie `.env` com seu token Ngrok:

  ```env
  NGROK_AUTHTOKEN=<SEU_NGROK_AUTHTOKEN>
  ```

- No backend, copie `olhoabertobackend/dataSearcher/.example-env` para `.env` e preencha as variáveis, como conexão MongoDB e chaves.

- No frontend, se existir `.example-env`, faça o mesmo em `olhoabertofrontend/`.

---

## Como Rodar

### Rodar com Docker (Online)

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Isso irá construir as imagens e iniciar os serviços (backend, frontend e Ngrok).

### Rodar Localmente (Sem Docker)

> ⚠️ Caso seja a primeira vez que você rode o projeto, execute primeiro o **dataFeeder** para baixar e salvar os arquivos no banco de dados.

#### No dataFeeder (`olhoabertobackend/dataFeeder`):

```bash
npm install
npm run start ou npm run dev
```

1. No backend (`olhoabertobackend/dataSearcher`):

```bash
npm install
npm run dev
```

2. No frontend (`olhoabertofrontend`):

```bash
npm install
npm run dev
```

Assegure-se de que as variáveis de ambiente estejam configuradas corretamente em ambos os ambientes.

---

## Acessando a Aplicação

- Frontend local:  
  [http://localhost:3000](http://localhost:3000)

- URL pública Ngrok:  
  Acesse a dashboard Ngrok em [http://localhost:4040](http://localhost:4040) para ver o endereço HTTPS público para o frontend.

---

## Parando o Projeto

Para parar e remover os containers Docker:

- Pressione `Ctrl+C` no terminal onde o `docker compose up` está rodando  
- Em seguida, execute:

```bash
docker compose down
```

---

## Observação

Este projeto foi desenvolvido em equipe como parte de um desafio proposto pela empresa **Brintell** ao nosso squad. O desenvolvimento do **Olho Aberto**, envolveu o trabalho conjunto de toda a equipe, com responsabilidades divididas entre backend, frontend, integrações com IA e o Banco de Dados.

---

## Contribuindo

Contribuições são bem-vindas! Abra issues para bugs e sugestões e envie pull requests seguindo as boas práticas.

---

## Licença

Este projeto está licenciado sob a licença MIT.
