#!/bin/bash

SERVER=mini_blog_server
CLIENT=mini_blog_client

run_server() {
  docker exec -it $SERVER sh -c "cd /app && $*"
}

run_client() {
  docker exec -it $CLIENT sh -c "cd /app && $*"
}

case "$1" in
  server)
    shift
    run_server "$@"
    ;;
  client)
    shift
    run_client "$@"
    ;;
  migrate)
    shift
    run_server npx prisma migrate dev --name "$1"
    ;;
  studio)
    run_server npx prisma studio
    ;;
  seed)
    run_server node prisma/seed.js
    ;;
  down)
    docker-compose down
    ;;
  up)
    docker-compose up --build
    ;;
  restart)
    docker-compose down && docker-compose up --build
    ;;
  stop)
    docker-compose stop
    ;;
  start)
    docker-compose start
    ;;
  *)
    echo "Usage:"
    echo "  ./dev.sh server <cmd>     # Run command in server container"
    echo "  ./dev.sh client <cmd>     # Run command in client container"
    echo "  ./dev.sh migrate <name>   # Run Prisma migration"
    echo "  ./dev.sh studio           # Open Prisma Studio"
    echo "  ./dev.sh seed             # Run DB seeding"
    echo "  ./dev.sh down             # docker-compose down"
    echo "  ./dev.sh up               # docker-compose up --build"
    echo "  ./dev.sh restart          # Restart all containers (down + up)"
    echo "  ./dev.sh stop             # Stop containers"
    echo "  ./dev.sh start            # Start previously stopped containers"
    ;;
esac
