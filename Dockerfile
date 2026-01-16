# =========================
# Stage 1: Build Angular app
# =========================
FROM node:20-alpine AS build-step

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g @angular/cli

COPY . .
RUN ng build --configuration production

# =========================
# Stage 2: Nginx web server
# =========================
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-step /app/dist/ds2023-30441-baciu-simina-assignment-1-frontend /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

