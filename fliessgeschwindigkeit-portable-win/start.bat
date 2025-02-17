@echo off
cd %~dp0
set PORT=8081
echo Starte Server auf Port %PORT%...
rem Starte den Server in einem neuen Fenster
start "Server" node server.js %PORT%
rem Warte 3 Sekunden, damit der Server Zeit hat hochzufahren
timeout /t 3 >nul
rem Öffne den Browser mit der URL
start "" "http://localhost:%PORT%"
pause
