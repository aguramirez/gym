#!/bin/sh
echo "Iniciando aplicación Java con perfil prod..."
java -jar /app/app.jar --spring.profiles.active=prod