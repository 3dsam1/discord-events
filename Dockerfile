FROM node:current-alpine

WORKDIR /EC Bot

COPY package*.json ./

RUN npm install

COPY . .

RUN node deploy-commands-global.js
CMD ["node", "main.js"]
