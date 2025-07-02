#for base
FROM node:20-alpine3.16 AS base

WORKDIR /app/admin
RUN apk add --no-cache libssl1.1



#for development
FROM base as dev

COPY package.json ./
# Cài openssl1.1 cho Prisma

RUN npm install
COPY . .
RUN npm run prisma:generate

EXPOSE 5002

CMD ["npm","run","dev" ]



FROM base AS builder

COPY package.json ./
RUN npm inst
COPY  .env ./
COPY . .

RUN npm run prisma:generate
RUN npm run build




FROM base as prod

COPY --from=builder /app/admin/dist ./dist
COPY --from=builder /app/admin/prisma ./prisma
COPY --from=builder /app/admin/package.json .
COPY --from=builder /app/admin/package-lock.json .
COPY --from=builder /app/admin/.env .


RUN npm ci --omit=dev

# RUN npm install && npm cache clean --force

EXPOSE 5002
#hello
# CMD ["npm","run","dev" ]
CMD ["npm","start" ]


