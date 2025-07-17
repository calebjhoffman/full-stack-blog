FROM node:20-alpine

RUN apk add --no-cache \
  libc6-compat \
  libjpeg-turbo-dev \
  libpng-dev \
  vips-dev

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --save-dev nodemon

COPY . .

# Prisma client generated at build time
RUN npx prisma generate

EXPOSE 3000

# DO NOT run the entrypoint here — just define it
CMD ["sh", "./docker-entrypoint.sh"]
