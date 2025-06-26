FROM node:20-alpine3.16 AS builder

WORKDIR /app/rbac
RUN apk add --no-cache libssl1.1

COPY package.json ./
RUN npm install

COPY . .



FROM node:20-alpine3.16

WORKDIR /app/rbac
RUN apk add --no-cache libssl1.1

COPY --from=builder /app/rbac ./

# RUN npm install && npm cache clean --force

EXPOSE 5004

CMD ["npm","start"]
