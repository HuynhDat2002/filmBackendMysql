#Build stage
FROM node:20-alpine AS base

WORKDIR /app/filmFrontendAdmin


FROM base AS dev
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm","run","dev"]


FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#production stage
FROM  base AS prod
COPY --from=builder /app/filmFrontendAdmin/next.config.mjs ./next.config.mjs
COPY --from=builder /app/filmFrontendAdmin/public ./public
COPY --from=builder /app/filmFrontendAdmin/.next ./.next
COPY --from=builder /app/filmFrontendAdmin/package.json ./package.json
COPY --from=builder /app/filmFrontendAdmin/package-lock.json ./package-lock.json

RUN npm ci --omit=dev
EXPOSE 3001
CMD [ "npm","start" ]