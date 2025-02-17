#!/bin/bash
cd "$(dirname "$0")"
PORT=8081
echo "Starte Server auf Port $PORT..."
chmod +x ./node
./node server.js $PORT
# Warten, um den Output zu sehen
sleep infinity
