# Build docker image after applied changes:
# to builkd everything from docker-compose.yml file:
# docker compose build
# or to build only the image w/o any services declared in docker-compose.yml file:
# docker build -t nestjs-docker .

# Use the official Node.js image as the base image
FROM node:18.20.4

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env and .env.development files
COPY .env  ./

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]