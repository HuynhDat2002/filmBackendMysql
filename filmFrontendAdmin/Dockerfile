#Build stage
FROM  node:18 AS builder
WORKDIR /app/filmFrontendAdmin
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#production stage
FROM  node:18
WORKDIR /app/filmFrontendAdmin
COPY --from=builder /app/filmFrontendAdmin/next.config.mjs ./next.config.mjs
COPY --from=builder /app/filmFrontendAdmin/public ./public
COPY --from=builder /app/filmFrontendAdmin/.next ./.next
COPY --from=builder /app/filmFrontendAdmin/node_modules ./node_modules
COPY --from=builder /app/filmFrontendAdmin/package.json ./package.json

CMD [ "npm","start" ]