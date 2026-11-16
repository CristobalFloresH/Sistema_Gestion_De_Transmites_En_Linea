# Imagen del frontend en dos etapas, basada en la guía 5.1 de la profesora
# Etapa 1: Node.js genera el build de React con Vite
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Dirección de la API que usará el navegador. Vite la deja fija dentro del build,
# por eso se recibe al construir (docker-compose la cambia al puerto de Docker)
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Etapa 2: Nginx entrega los archivos generados
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
