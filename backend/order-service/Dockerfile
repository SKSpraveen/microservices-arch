# For all Java services (order, review, restaurant)
# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS builder 

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jdk-jammy  

WORKDIR /app
# 1. Fix stage reference casing
# 2. Use wildcard for JAR name
COPY --from=builder /app/target/*.jar app.jar 

EXPOSE 3005
CMD ["java", "-jar", "app.jar"]