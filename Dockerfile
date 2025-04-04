# Primera etapa: Construir la aplicación
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copiar el proyecto backend
COPY backend/pom.xml ./
# Descargar dependencias primero (para aprovechar caché)
RUN mvn dependency:go-offline

# Copiar el código fuente y compilar
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Segunda etapa: Ejecutar la aplicación
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Instalar herramientas básicas
RUN apk add --no-cache bash curl

# Copiar el JAR construido
COPY --from=build /app/target/*.jar app.jar

# Puerto expuesto
EXPOSE 8080

# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "/app/app.jar", "--spring.profiles.active=prod"]