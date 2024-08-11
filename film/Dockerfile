FROM node:latest

WORKDIR /app/film

COPY package.json .

RUN npm install

COPY . .


EXPOSE 5003

CMD [ "npm","start" ]