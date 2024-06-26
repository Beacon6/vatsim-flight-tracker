FROM node:18-alpine

WORKDIR /usr/src/app

EXPOSE 5000

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build

CMD ["npm", "start"]
