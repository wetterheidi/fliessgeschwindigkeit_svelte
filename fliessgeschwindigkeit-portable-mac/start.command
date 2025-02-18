#!/bin/bash
cd "$(dirname "$0")"
PORT=8081
echo "Starte Server auf Port $PORT..."
chmod +x ./node
# Starte den Server im Hintergrund
./node server.js $PORT &
# Warte 3 Sekunden
sleep 3
# Öffne den Browser (funktioniert auf macOS)
open "http://localhost:$PORT"
# Warte auf Benutzerinteraktion
read -n 1 -s -r -p "Drücke eine beliebige Taste zum Beenden..."
# Beende den Server-Prozess
kill $!
