@echo off
echo ========================================
echo   Climate Dashboard - Full Installation
echo ========================================
echo.
echo This will install all dependencies.
echo This may take 5-10 minutes.
echo.
pause

echo.
echo [1/3] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Root installation failed
    pause
    exit /b 1
)
echo [OK] Root dependencies installed
echo.

echo [2/3] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Server installation failed
    pause
    exit /b 1
)
echo [OK] Server dependencies installed
cd ..
echo.

echo [3/3] Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Client installation failed
    pause
    exit /b 1
)
echo [OK] Client dependencies installed
cd ..
echo.

echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo You can now run the application:
echo   1. Double-click: start-server.bat
echo   2. Double-click: start-client.bat
echo.
echo Or use manual commands:
echo   Terminal 1: cd server ^&^& npm start
echo   Terminal 2: cd client ^&^& npm start
echo.
pause
