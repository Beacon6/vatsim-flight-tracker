FROM node:20

WORKDIR /usr/src/app

ENV PORT 5000

COPY package*.json ./

RUN npm install

COPY . ./

RUN npx tsc -p .

CMD ["node", "server.js"]
