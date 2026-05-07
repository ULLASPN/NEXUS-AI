@echo off
echo ===================================================
echo   NEXUS AI - CYBER DEFENSE SYSTEM INITIALIZER
echo ===================================================
echo.
echo [1/3] Checking dependencies...
if not exist node_modules (
    echo [2/3] Installing libraries (this may take a minute)...
    call npm install
) else (
    echo [2/3] Libraries already installed.
)
echo.
echo [3/3] Starting the Futuristic Dashboard...
echo.
echo >>> Once the link http://localhost:5173 appears, open it in your browser!
echo.
call npm run dev
pause
