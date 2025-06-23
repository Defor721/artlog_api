FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
# prisma 클라이언트는 빌드시 생성되기 때문에 generate 과정을 넣어야 함.
RUN npx prisma generate 

RUN npm run build

CMD ["node", "dist/main"]

EXPOSE 3000

COPY .env .env