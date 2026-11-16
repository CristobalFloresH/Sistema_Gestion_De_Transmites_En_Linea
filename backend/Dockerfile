# Imagen de la API Express, basada en la guía 5.1 de la profesora
FROM node:24-bookworm-slim

WORKDIR /app

# Primero solo las dependencias, así Docker reutiliza esta capa si el código cambia y package.json no
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --chown=node:node . .

# Carpeta de los PDF subidos: el usuario node tiene que poder escribir en ella
RUN mkdir -p uploads && chown node:node uploads

ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "src/app.js"]
