FROM node:20-alpine

# Set working directory
WORKDIR /app

# Make sure devDependencies are installed
ENV NODE_ENV=development

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port Vite uses
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev"]
