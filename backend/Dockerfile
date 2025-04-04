FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el JAR compilado
COPY backend/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Copiar el script de entrada y darle permisos de ejecución
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Exponer el puerto
EXPOSE 8080

# Usar el script como punto de entrada
ENTRYPOINT ["/app/entrypoint.sh"]