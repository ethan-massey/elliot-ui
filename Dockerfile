FROM node:19-alpine3.17

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]