FROM node:22-alpine

ARG VITE_SERVER=${VITE_SERVER}

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
