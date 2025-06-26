FROM node:20-alpine3.16 AS builder

WORKDIR /app/film
RUN apk add --no-cache libssl1.1

COPY package.json ./

RUN npm install

COPY . .


FROM node:20-alpine3.16

WORKDIR /app/film
RUN apk add --no-cache libssl1.1

COPY --from=builder /app/film ./

EXPOSE 5003

CMD [ "npm","start"]