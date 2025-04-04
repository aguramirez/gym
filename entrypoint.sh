#!/bin/sh

echo "Starting Spring Boot application with profile: prod"
exec java -jar /app/app.jar --spring.profiles.active=prod