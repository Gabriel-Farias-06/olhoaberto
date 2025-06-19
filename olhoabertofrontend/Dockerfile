# Etapa de dependências
FROM node:21-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm i --omit=dev

# Etapa de build
FROM node:21-alpine AS builder
WORKDIR /app
COPY . .                          
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Etapa final para rodar a aplicaçãoddd
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
