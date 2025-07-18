FROM node:20-alpine

# Install native build tools and sharp deps
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

# Install dependencies
COPY package*.json ./

# Force optional deps for musl (sharp, rollup, etc.)
RUN npm install --force --include=optional --unsafe-perm

# Copy rest of the app
COPY . .

EXPOSE 3000

CMD ["sh", "./docker-entrypoint.sh"]