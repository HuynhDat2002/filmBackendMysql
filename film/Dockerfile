FROM node:latest

WORKDIR /app/film

COPY package.json .

RUN npm install

COPY . .

# RUN npx prisma migrate dev --name init

EXPOSE 5003

CMD [ "npm","start" ]