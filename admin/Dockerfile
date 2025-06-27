FROM node:20-alpine3.16 AS builder

WORKDIR /app/admin
RUN apk add --no-cache libssl1.1

COPY package.json ./
RUN npm install

COPY . .


# ----------- Stage 2: Runtime -----------
FROM node:20-alpine3.16

# Tạo thư mục làm việc
WORKDIR /app/admin
RUN apk add --no-cache libssl1.1
RUN npm install
# Copy built code & package.json từ builder
COPY --from=builder /app/admin ./
# Mở port ứng dụng
EXPOSE 5002

# Chạy ứng dụng
CMD ["npm", "start"]