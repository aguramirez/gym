FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el JAR compilado
COPY backend/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto
EXPOSE 8080

# Ejecutar la aplicación directamente sin scripts intermedios
CMD ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]