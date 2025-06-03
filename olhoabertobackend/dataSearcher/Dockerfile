FROM mcr.microsoft.com/playwright:v1.50.0-noble

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY . .

RUN pnpm i

RUN ls -la && rm -rf node_modules && pnpm i

RUN npx playwright install

EXPOSE 4000

# Start the application
CMD ["npm", "start"]
