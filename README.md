# ArtLog API Server

NestJS, Prisma, JWT 기반의 RESTful API 서버입니다.

## 기술 스택

- NestJS
- Prisma
- MongoDB 
- JWT (Passport 기반 인증)
- Winston(로깅)
- Swagger (API 문서 자동화)
- AWS S3 Bucket(이미지 저장)

## Project setup (Development)

- git clone https://github.com/Defor721/artlog_api.git
- cd artlog_api
- npm install

## Swagger

 - http://localhost:3000/api-docs

## Folder structure

```txt
src/
├── auth/          로그인, 회원가입, JWT
├── users/         사용자 관련 API
├── posts/         관람 기록 관련 API
├── performances/  공연 정보 API
├── common/        공통 데코레이터, 가드
├── prisma/        Prisma 설정
├── redis/         Redis 설정
├── types/         타입 설정
├── workers/       워커스레드 설정
├── main.ts
└── app.module.ts
