# syntax=docker/dockerfile:1

########################
# 1) Dependencies layer
########################
FROM node:lts-alpine AS deps
WORKDIR /app

COPY frontend/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

########################
# 2) Development (CRA)
########################
FROM node:lts-alpine AS dev
WORKDIR /app

ENV HOST=0.0.0.0 \
    PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./

EXPOSE 3000
CMD ["npm", "start"]

########################
# 3) Build (production)
########################
FROM node:lts-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./

RUN npm run build

########################
# 4) Serve (nginx)
########################
FROM nginx:alpine AS prod

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

