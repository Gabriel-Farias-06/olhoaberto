# Install dependencies only when needed
FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a6ec37d9#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev # Install only production dependencies here if you want a leaner deps stage

# Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm install --only=dev
RUN npm run build

# Production image, copy all files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Next.js production server needs specific files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Only copy production node_modules for the runner
# If you ran `npm install --omit=dev` in deps, then deps's node_modules is production-only
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]