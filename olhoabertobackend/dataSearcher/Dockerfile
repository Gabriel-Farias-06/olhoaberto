# Stage 1: Install dependencies
FROM mcr.microsoft.com/playwright:v1.50.0-noble AS deps

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only package files first for better layer caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (including Playwright dependencies)
RUN pnpm install

# Then copy the rest of the app source code
COPY . .

# Stage 2: Build and install Playwright browsers
FROM mcr.microsoft.com/playwright:v1.50.0-noble AS playwright_build

WORKDIR /app

# Copy everything from deps stage (including node_modules)
COPY --from=deps /app /app

# Install Playwright browsers
RUN npx playwright install --with-deps

ENV NODE_ENV=production

# Expose the port (adjust if your app uses a different one)
EXPOSE 4000

# Run your app
CMD ["npm", "start"]
