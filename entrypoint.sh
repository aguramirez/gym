#!/bin/sh

echo "Starting Spring Boot application with profile: prod"
echo "Using PORT: $PORT"
sleep 5
exec java -jar /app/app.jar --spring.profiles.active=prod --server.port=$PORT