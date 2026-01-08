FROM node:18-alpine

# Instalar dependencias necesarias para build
RUN apk add --no-cache python3 make g++

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar la app
CMD ["node", "src/server.js"]
