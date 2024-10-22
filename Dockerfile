FROM node:22-alpine

ARG VITE_API_SERVER=${VITE_API_SERVER}

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
