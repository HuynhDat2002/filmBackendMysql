#Build stage
FROM  node:18 AS builder
WORKDIR /app/filmFrontendUser
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#production stage
FROM  node:18
WORKDIR /app/filmFrontendUser
COPY --from=builder /app/filmFrontendUser/next.config.mjs ./next.config.mjs
COPY --from=builder /app/filmFrontendUser/public ./public
COPY --from=builder /app/filmFrontendUser/.next ./.next
COPY --from=builder /app/filmFrontendUser/node_modules ./node_modules
COPY --from=builder /app/filmFrontendUser/package.json ./package.json

CMD [ "npm","run","dev" ]