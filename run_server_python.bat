@echo off
setlocal

echo ==========================================
echo    Dhahab Al Ramal - Luxury Perfumes
echo    Local Server Launcher
echo ==========================================
echo.

:: Check for python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PY_CMD=python
    goto :start_server
)

:: Check for py (Windows launcher)
py --version >nul 2>&1
if %errorlevel% equ 0 (
    set PY_CMD=py
    goto :start_server
)

:: Check for python3
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    set PY_CMD=python3
    goto :start_server
)

echo [!] ERROR: Python was not found on your system.
echo.
echo To run this website locally, you need Python.
echo 1. Download it from: https://www.python.org/downloads/
echo 2. During installation, make sure to check "Add Python to PATH".
echo.
echo Alternatively, you can open "index.html" directly in your browser, 
echo although some features may be limited.
echo.
pause
exit /b 1

:start_server
echo [+] Using %PY_CMD% to start the server.
echo [+] Please keep this window open while browsing.
echo.
echo [+] Opening http://localhost:8000 in your browser...
start http://localhost:8000
echo.
echo [+] Server is running...
%PY_CMD% -m http.server 8000
pause
