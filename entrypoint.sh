#!/bin/sh

echo "Starting Spring Boot application with profile: prod"
sleep 5
# Ejecutar Spring Boot y pasar el puerto que Railway espera
exec java -jar /app/app.jar --spring.profiles.active=prod --server.port=$PORT