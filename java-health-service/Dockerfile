FROM gradle:8-jdk17 AS build
WORKDIR /home/gradle/src
COPY . .
RUN gradle installDist --no-daemon

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /home/gradle/src/build/install/health-service /app
EXPOSE 8080
CMD ["/app/bin/health-service"]
