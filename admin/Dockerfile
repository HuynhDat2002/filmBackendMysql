FROM node:latest

WORKDIR /app/admin

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5002

CMD [ "npm","start" ]