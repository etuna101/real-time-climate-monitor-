@echo off
echo ========================================
echo   Climate Dashboard - Starting Server
echo ========================================
echo.
cd server
echo Installing server dependencies...
call npm install
echo.
echo Starting server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
call npm start
