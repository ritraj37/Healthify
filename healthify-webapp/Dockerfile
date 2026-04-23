# Multi-stage build for production-ready Tomcat + Healthify app
FROM maven:3.9-openjdk-11-slim AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Production stage
FROM tomcat:10.1-jdk11-openjdk-slim

# Remove default webapps
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy built WAR file
COPY --from=builder /app/target/healthify.war /usr/local/tomcat/webapps/ROOT.war

# Copy HikariCP JAR to Tomcat lib (for JNDI DataSource)
RUN wget -O /usr/local/tomcat/lib/HikariCP.jar \
    https://repo1.maven.org/maven2/com/zaxxer/HikariCP/5.0.1/HikariCP-5.0.1.jar

# Copy MySQL Connector
RUN wget -O /usr/local/tomcat/lib/mysql-connector-java.jar \
    https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.33/mysql-connector-java-8.0.33.jar

# Copy SLF4J JARs for logging
RUN wget -O /usr/local/tomcat/lib/slf4j-api.jar \
    https://repo1.maven.org/maven2/org/slf4j/slf4j-api/2.0.9/slf4j-api-2.0.9.jar

# Create healthify user for security
RUN groupadd -r healthify && useradd -r -g healthify healthify

# Set proper permissions
RUN chown -R healthify:healthify /usr/local/tomcat
USER healthify

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Expose port
EXPOSE 8080

# JVM optimization for containers
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC -XX:+UseContainerSupport -Djava.security.egd=file:/dev/./urandom"

# Start Tomcat
CMD ["catalina.sh", "run"]