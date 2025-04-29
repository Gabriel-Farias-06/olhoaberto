FROM mcr.microsoft.com/playwright:v1.50.0-noble

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /usr/src/app

# Copy only package manager files to install dependencies first
COPY package.json pnpm-lock.yaml ./

# Use cached npm dependencies
RUN --mount=type=cache,target=/root/.npm \
    pnpm i --frozen-lockfile

# Copy the remaining application code
COPY . .

# Ensure node_modules is not overwritten
RUN ls -la && rm -rf node_modules && pnpm i --frozen-lockfile

RUN npx playwright install

# Start the application
CMD ["npm", "start"]
