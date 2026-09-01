# Build stage
FROM node:22-alpine AS build-stage
WORKDIR /app

COPY book-network-ui/package*.json ./
RUN npm install

COPY book-network-ui/ .
RUN npm run build --prod

# Runtime stage
FROM nginx:alpine

COPY book-network-ui/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist/book-network-ui/browser /usr/share/nginx/html

EXPOSE 80