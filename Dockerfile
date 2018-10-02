FROM node:8-alpine

RUN mkdir app

WORKDIR /app

ADD package.json .

ADD package-lock.json .

RUN npm i --only=production

ADD src src

ADD webpack.config.js .

RUN npm run build

CMD node dist/main.js