#for base
FROM node:20-alpine3.16 AS base

WORKDIR /app/film
RUN apk add --no-cache libssl1.1



#for development
FROM base as dev

COPY package.json ./
# Cài openssl1.1 cho Prisma

RUN npm install
COPY . .
RUN npm run prisma:generate

EXPOSE 5003

CMD ["npm","run","dev" ]



FROM base AS builder

COPY package.json ./
RUN npm install
COPY  .env ./
COPY . .

RUN npm run prisma:generate && npm run build


FROM base as prod

COPY --from=builder /app/film/dist ./dist
COPY --from=builder /app/film/prisma ./prisma
COPY --from=builder /app/film/package.json .
COPY --from=builder /app/film/package-lock.json .
COPY --from=builder /app/film/.env .


RUN npm ci --omit=dev

# RUN npm install && npm cache clean --force

EXPOSE 5003

# CMD ["npm","run","dev" ]
CMD ["npm","start" ]
