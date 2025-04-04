# Primera etapa: Construir la aplicación
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copiar el proyecto backend
COPY backend /app/

# Compilar la aplicación
RUN mvn clean package -DskipTests

# Segunda etapa: Ejecutar la aplicación
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar el JAR construido
COPY --from=build /app/target/*.jar app.jar

# Puerto expuesto
EXPOSE 8080

# Comando para iniciar la aplicación (simplificado)
ENTRYPOINT ["java", "-jar", "/app/app.jar"]