# Use Node.js LTS (Long Term Support) as the base image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
# If you're building for production, use:
# RUN npm ci --omit=dev

# Copy app source code
COPY . .

# Copy .env.development file if it exists (commented out by default for security)
COPY .env .env

# Create .env.development file from environment variables if needed
# RUN touch .env.development

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
