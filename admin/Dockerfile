FROM node:latest

WORKDIR /app/admin

COPY package.json .

RUN npm install

COPY . .
# RUN npx prisma migrate dev --name init
EXPOSE 5002

CMD [ "npm","start" ]