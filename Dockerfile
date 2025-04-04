# Primera etapa: Compilación
FROM maven:3.9-eclipse-temurin-17-alpine AS build

# Configurar directorio de trabajo
WORKDIR /app

# Copiar el archivo pom.xml primero para aprovechar la caché de dependencias
COPY backend/pom.xml .

# Descargar dependencias
RUN mvn -B dependency:go-offline

# Copiar el código fuente
COPY backend/src ./src

# Compilar la aplicación
RUN mvn clean package -DskipTests

# Segunda etapa: Runtime
FROM eclipse-temurin:17-jre-alpine

# Configurar directorio de trabajo
WORKDIR /app

# Copiar el JAR compilado desde la primera etapa
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
# Al final del Dockerfile, reemplaza la línea CMD
COPY start.sh .
RUN chmod +x start.sh
CMD ["./start.sh"]