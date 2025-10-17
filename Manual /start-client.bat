@echo off
echo ========================================
echo   Climate Dashboard - Starting Client
echo ========================================
echo.
cd client
echo Installing client dependencies...
call npm install
echo.
echo Starting React app on http://localhost:3000
echo The browser will open automatically
echo Press Ctrl+C to stop the client
echo.
call npm start
