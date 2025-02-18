# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci --silent

# Copy source code
COPY . .

# Build client và server
RUN npm run build:client 
RUN npm run build:server

# Stage 2: Production environment
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (remove --only=production)
RUN npm ci --silent

# Copy built files từ stage builder
COPY --from=builder /app/dist ./dist

# Expose port cho server
EXPOSE 3000

# Start server
CMD ["node", "dist/server.js"]