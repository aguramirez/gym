FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el JAR compilado directamente
COPY backend/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]