FROM node:18-alpine AS build

WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm ci

# Copia código fuente y construye
COPY . .
RUN npm run build

# Segunda etapa con Nginx para servir contenido estático
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]