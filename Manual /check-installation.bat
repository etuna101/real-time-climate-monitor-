@echo off
echo ========================================
echo   Checking Installation Status
echo ========================================
echo.

echo Checking client dependencies...
if exist "client\node_modules" (
    echo [OK] Client node_modules exists
) else (
    echo [MISSING] Client dependencies not installed
    echo Run: cd client ^&^& npm install
)
echo.

echo Checking server dependencies...
if exist "server\node_modules" (
    echo [OK] Server node_modules exists
) else (
    echo [MISSING] Server dependencies not installed
    echo Run: cd server ^&^& npm install
)
echo.

echo Checking root dependencies...
if exist "node_modules" (
    echo [OK] Root node_modules exists
) else (
    echo [MISSING] Root dependencies not installed
    echo Run: npm install
)
echo.

echo ========================================
echo   Installation Check Complete
echo ========================================
pause
