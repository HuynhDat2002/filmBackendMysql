FROM node:20-alpine3.16 AS builder

WORKDIR /app/user


RUN apk add --no-cache libssl1.1
COPY package.json ./
# Cài openssl1.1 cho Prisma

RUN npm install
COPY . .



FROM node:20-alpine3.16

WORKDIR /app/user

RUN apk add --no-cache libssl1.1
RUN npm install
COPY --from=builder /app/user ./

# RUN npm install && npm cache clean --force

EXPOSE 5000

CMD ["npm","start" ]
