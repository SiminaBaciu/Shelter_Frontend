# Stage 1: Build the Angular application
FROM node:18.13-alpine as build-step

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install Angular CLI globally in the container
RUN npm install -g @angular/cli

# Copy the rest of the project files into the container
COPY . .

# Build the Angular project
RUN ng build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output from the build-step to the Nginx folder
COPY --from=build-step /app/dist/ds2023-30441-baciu-simina-assignment-1-frontend /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
