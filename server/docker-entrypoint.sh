#!/bin/sh
set -e
echo "⏳ Waiting for PostgreSQL to be ready..."

# Try connecting to db:5432 until it's up
until nc -z db 5432; do
  echo "❌ Database not ready. Retrying in 1s..."
  sleep 1
done

echo "✅ PostgreSQL is ready!"

echo "📦 Running Prisma migration..."
npx prisma migrate deploy

echo "🚀 Starting the Express server..."
npx nodemon --verbose
