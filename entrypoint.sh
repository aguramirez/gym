#!/bin/sh

echo "================================================================"
echo "Starting Spring Boot application with profile: prod"
echo "Using PORT: $PORT"
echo "================================================================"

# Versión simplificada compatible con /bin/sh de Alpine
if [ ! -z "$MYSQL_URL" ]; then
    echo "MySQL URL detectada: $MYSQL_URL"
    echo "Esperando 10 segundos para asegurar que MySQL esté disponible..."
    sleep 10
fi

# Ejecutar la aplicación
exec java -jar /app/app.jar --spring.profiles.active=prod --server.port=$PORT