# Build stage
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /build
COPY book-network/pom.xml .
RUN mvn dependency:go-offline
COPY book-network/src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:25
ARG APP_VERSION=1.0.0-SNAPSHOT

WORKDIR /app
COPY --from=build /build/target/book-network-*.jar /app/

EXPOSE 8080

ENV JAR_VERSION=${APP_VERSION}

CMD java -jar book-network-${JAR_VERSION}.jar
