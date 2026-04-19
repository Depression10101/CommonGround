# Stage 1: build the React frontend
FROM node:20-slim AS frontend
WORKDIR /frontend
COPY ["src/frontend/Code for UI/package.json", "src/frontend/Code for UI/package-lock.json", "./"]
RUN npm install --legacy-peer-deps
COPY ["src/frontend/Code for UI/", "./"]
RUN npm run build

# Stage 2: build the Java WAR with Maven
FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /app
COPY pom.xml .
COPY src/ src/
# Copy dist to a temp location first (Docker can't COPY directly into paths with spaces)
COPY --from=frontend /frontend/dist /tmp/frontend-dist/
RUN mkdir -p "src/frontend/Code for UI/dist" && cp -r /tmp/frontend-dist/. "src/frontend/Code for UI/dist/"
RUN mvn clean package -DskipTests

# Stage 3: run on Tomcat (plain HTTP — Railway handles HTTPS at the edge)
FROM tomcat:10.1-jdk17-temurin
RUN rm -rf /usr/local/tomcat/webapps/ROOT
COPY --from=backend /app/target/ROOT.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080
CMD ["catalina.sh", "run"]
