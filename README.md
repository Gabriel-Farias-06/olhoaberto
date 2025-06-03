
# Projeto Olho Aberto

Este projeto inclui um backend (`olhoabertobackend`), um frontend Next.js (`olhoabertofrontend`) e um túnel Ngrok para expor o frontend.

---

## Primeiros Passos

Siga estas instruções para rodar o projeto localmente.

### Pré-requisitos

Certifique-se de ter instalado:

- **Docker Desktop**: Inclui Docker Engine e Docker Compose.  
  ➡️ [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

- **Ngrok Auth Token**: Necessário para o serviço Ngrok.  
  ➡️ [Ngrok Signup](https://ngrok.com/signup)  
  ➡️ [Obtenha seu Ngrok Auth Token](https://dashboard.ngrok.com/get-started/your-authtoken)

---

## 1. Estrutura do Projeto

Verifique se a estrutura de pastas está correta:

```
.
├── .env                  # Token Ngrok e variáveis de ambiente globais
├── docker-compose.yml    # Configuração do Docker Compose
├── olhoabertobackend/
│   └── dataSearcher/
│       ├── Dockerfile
│       └── .env          # Variáveis de ambiente do backend
│       └── ...
├── olhoabertofrontend/
│   ├── Dockerfile
│   └── ...
└── README.md             # Este arquivo
```

---

## 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na **raiz do projeto** (onde está `docker-compose.yml`) e adicione seu token Ngrok:

```env
# .env (na raiz do projeto)
NGROK_AUTHTOKEN=<SEU_NGROK_AUTHTOKEN>
```

Assegure-se também de que o backend tenha seu `.env` em:  
`olhoabertobackend/dataSearcher/.env`

---

## 3. Buildar e Rodar o Projeto

No terminal, navegue até a **raiz do projeto** (onde está `docker-compose.yml`) e execute:

```bash
docker compose up --build
```

Este comando irá buildar as imagens e iniciar todos os serviços: **backend**, **frontend** e **Ngrok**.

---

## Acessando a Aplicação

### 1. Acesso Local do Frontend

Após os serviços estarem rodando, acesse o frontend localmente no seu navegador:

- **URL do Frontend:** http://localhost:3000

---

### 2. Verificando a URL do Ngrok

O serviço Ngrok cria uma URL pública para seu frontend. Para encontrá-la:

1. **Acesse a Interface Web do Ngrok:**  
   Abra seu navegador e vá para:  
   http://localhost:4040

2. **Encontre a URL de Encaminhamento:**  
   Na dashboard do Ngrok, procure pela seção **"Forwarding"**.  
   Você verá uma URL HTTPS como:  
   `https://xxxx-xx-xxx-xxx-xx.ngrok-free.app`  

Esta é a **URL pública** do seu frontend.  
Você pode compartilhá-la para permitir acesso externo à sua aplicação.

---

## Parando o Projeto

Para parar e remover todos os containers Docker:

1. Pressione `Ctrl+C` no terminal onde `docker compose up` está rodando.
2. Depois execute:

```bash
docker compose down
```
