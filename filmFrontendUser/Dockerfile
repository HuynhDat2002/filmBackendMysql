#Build stage
FROM node:20-alpine AS base

WORKDIR /app/filmFrontendUser


FROM base AS dev
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","run","dev"]


FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#production stage
FROM  base AS prod
COPY --from=builder /app/filmFrontendUser/next.config.mjs ./next.config.mjs
COPY --from=builder /app/filmFrontendUser/public ./public
COPY --from=builder /app/filmFrontendUser/.next ./.next
COPY --from=builder /app/filmFrontendUser/package.json ./package.json
COPY --from=builder /app/filmFrontendUser/package-lock.json ./package-lock.json

RUN npm ci --omit=dev
EXPOSE 3000
CMD [ "npm","start" ]