FROM node:20.18.1

WORKDIR /app/rbac

COPY package.json .

RUN npm install

COPY . .
# RUN npx prisma migrate dev --name init
EXPOSE 5004

# # Sao chép script wait-for-it.sh vào container
# COPY wait-for-it.sh /app/user/wait-for-it.sh
# RUN chmod +x /app/user/wait-for-it.sh
# RUN chmod +x ./wait-for-it.sh


CMD ["npm","start"]

