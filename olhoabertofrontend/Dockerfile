FROM node:18-alpine

WORKDIR /app

COPY olhoabertofrontend/package*.json ./

RUN npm install

COPY olhoabertofrontend/ .

EXPOSE 3000

CMD ["npm", "run", "dev"]