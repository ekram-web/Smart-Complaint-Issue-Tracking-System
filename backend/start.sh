#!/bin/bash
# Startup script for Render deployment

echo "Running database migrations..."
npx prisma db push --accept-data-loss

echo "Seeding database..."
node dist/utils/seed.js || echo "Seeding failed or already seeded"

echo "Starting server..."
node dist/server.js
