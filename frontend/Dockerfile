FROM node:20-alphine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN pnpm install
COPY . .
RUN pnpm builder
FROM nginx:alpine
EXPOSE 80
