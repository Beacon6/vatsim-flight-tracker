FROM node:20

WORKDIR /usr/src/app

ENV PORT 5000

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build

CMD ["npm", "start"]