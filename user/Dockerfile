#for base
FROM node:20-alpine3.16 AS base

WORKDIR /app/user
RUN apk add --no-cache libssl1.1

#for development
FROM base as dev

COPY package.json ./
# Cài openssl1.1 cho Prisma

RUN npm install
COPY . .
RUN npx prisma generate

EXPOSE 5000

CMD ["npm","run","dev" ]


FROM base AS builder

COPY package.json ./
# Cài openssl1.1 cho Prisma

RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build


FROM base as prod

COPY --from=builder /app/user/dist ./dist
COPY --from=builder /app/user/prisma ./prisma
COPY --from=builder /app/user/package.json .
COPY --from=builder /app/user/package-lock.json .


RUN npm ci --omit=dev

# RUN npm install && npm cache clean --force

EXPOSE 5000

# CMD ["npm","run","dev" ]
CMD ["npm","start" ]

