FROM node:20-alpine

# Install required build dependencies (sharp, rollup-native, etc.)
RUN apk add --no-cache \
  libc6-compat \
  libjpeg-turbo-dev \
  libpng-dev \
  vips-dev \
  python3 \
  make \
  g++ \
  build-base

WORKDIR /app

COPY package*.json ./

# Force install optional native modules like sharp & rollup
RUN npm install --include=optional

# Install dev-only tools like nodemon
RUN npm install --save-dev nodemon

COPY . .

EXPOSE 3000

# Final startup command
CMD ["sh", "./docker-entrypoint.sh"]
