#!/bin/sh

echo "================================================================"
echo "Starting Spring Boot application with profile: prod"
echo "Using PORT: $PORT"
echo "================================================================"

# Esperamos a que MySQL esté disponible (si hay un servicio de MySQL en Railway)
if [ ! -z "$MYSQL_URL" ]; then
    echo "Waiting for MySQL to be available..."
    
    # Extraer host y puerto de MYSQL_URL usando expresiones regulares
    if [[ $MYSQL_URL =~ jdbc:mysql://([^:/]+)(:([0-9]+))?/ ]]; then
        DB_HOST=${BASH_REMATCH[1]}
        DB_PORT=${BASH_REMATCH[3]:-3306}
        
        echo "DB Host: $DB_HOST, DB Port: $DB_PORT"
        
        # Esperar hasta que MySQL esté disponible
        until nc -z -v -w30 $DB_HOST $DB_PORT; do
            echo "MySQL todavía no está disponible, esperando..."
            sleep 2
        done
        
        echo "MySQL está disponible, continuando..."
    else
        echo "No se pudo analizar MYSQL_URL, continuando sin esperar la base de datos."
    fi
fi

# Ejecutar la aplicación
exec java -jar /app/app.jar --spring.profiles.active=prod --server.port=$PORT