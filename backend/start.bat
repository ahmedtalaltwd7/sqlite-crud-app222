@echo off
cd /d "%~dp0"

echo Starting Node.js server...
start cmd /k "node server.js"

timeout /t 2 > nul

echo Opening browser...
start http://localhost:8080

echo Done.
exit
