#!/bin/bash

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Export environment variables from .env file
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Start Daphne server for WebSockets
echo "Starting WebSocket server..."
daphne -b 0.0.0.0 -p 8001 restaurant_pos.asgi:application

