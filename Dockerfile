# Primera etapa: Construir la aplicación
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copiar todo el contenido del backend
COPY backend/pom.xml ./
COPY backend/src ./src
COPY backend/.mvn ./.mvn
COPY backend/mvnw ./mvnw
RUN chmod +x mvnw

# Compilar el proyecto
RUN ./mvnw clean package -DskipTests

# Segunda etapa: Ejecutar la aplicación
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar el JAR construido
COPY --from=build /app/target/*.jar app.jar

# Puerto expuesto
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]