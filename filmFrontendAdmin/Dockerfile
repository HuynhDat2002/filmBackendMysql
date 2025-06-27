#Build stage
FROM  node:18-alpine AS builder
WORKDIR /app/filmFrontendAdmin
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#production stage
FROM  node:18-alpine
WORKDIR /app/filmFrontendAdmin
RUN npm install
# COPY --from=builder /app/filmFrontendAdmin/next.config.mjs ./next.config.mjs
# COPY --from=builder /app/filmFrontendAdmin/public ./public
# COPY --from=builder /app/filmFrontendAdmin/.next ./.next
# COPY --from=builder /app/filmFrontendAdmin/node_modules ./node_modules
# COPY --from=builder /app/filmFrontendAdmin/package.json ./package.json
COPY --from=builder /app/filmFrontendAdmin ./

CMD [ "npm","run","dev" ]