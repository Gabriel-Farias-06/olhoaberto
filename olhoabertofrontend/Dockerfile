# Etapa de dependências
FROM node:21-alpine AS deps
WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copia arquivos de definição de dependências
COPY package.json pnpm-lock.yaml* ./

# Instala as dependências com pnpm (sem dev, se quiser)
RUN pnpm install --frozen-lockfile --prod

# Etapa de build
FROM node:21-alpine AS builder
WORKDIR /app

# Instala pnpm no builder também
RUN npm install -g pnpm

COPY . .

# Copia node_modules da etapa deps
COPY --from=deps /app/node_modules ./node_modules

# Roda o build com pnpm
RUN pnpm run build

# Etapa final de execução
FROM node:21-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "start"]
