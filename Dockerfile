# Etapa 1: Construcción del JAR
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend /app
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final y ligera
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiamos solo el .jar del build anterior
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Copiamos el entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Variable de entorno por defecto (Railway la sobreescribirá)
ENV PORT=8080

# Puerto expuesto
EXPOSE ${PORT}

# Comando para ejecutar Spring Boot
ENTRYPOINT ["/app/entrypoint.sh"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1