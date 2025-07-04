#for base
FROM node:20-alpine3.16 AS base

WORKDIR /app/rbac
RUN apk add --no-cache libssl1.1



#for development
FROM base AS dev

COPY package.json ./
# Cài openssl1.1 cho Prisma
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 5004

CMD ["npm","run","dev" ]



FROM base AS builder

COPY package.json ./
COPY  .env ./
RUN npm install
COPY prisma ./prisma
COPY . .

RUN npx prisma generate &&  npm run build




FROM base AS prod

COPY --from=builder /app/rbac/dist ./dist
COPY --from=builder /app/rbac/prisma ./prisma
COPY --from=builder /app/rbac/package.json .
COPY --from=builder /app/rbac/package-lock.json .
COPY --from=builder /app/rbac/.env .


RUN npm ci --omit=dev

# RUN npm install && npm cache clean --force

EXPOSE 5004

# CMD ["npm","run","dev" ]
CMD ["npm","start" ]
