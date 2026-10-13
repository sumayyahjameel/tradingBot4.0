@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   APEX-QUANT HACKATHON LIVE DEMO LAUNCHER
echo ===================================================

cd /d "%~dp0"

REM 1. Verify frontend build exists
if not exist "frontend\dist\index.html" (
    echo [INFO] Frontend build not detected. Building frontend...
    cd frontend
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Frontend build failed.
        exit /b 1
    )
    cd ..
) else (
    echo [OK] Production frontend bundle detected.
)

REM 2. Identify Python executable
set PYTHON_EXE=python
if exist "venv\Scripts\python.exe" (
    set PYTHON_EXE=venv\Scripts\python.exe
) else if exist "..\venv\Scripts\python.exe" (
    set PYTHON_EXE=..\venv\Scripts\python.exe
)

echo [OK] Using Python: %PYTHON_EXE%

REM 3. Set demo environment variables
set PORT=5000
set HOST=127.0.0.1
set PYTHONUNBUFFERED=1

echo [INFO] Starting APEX-QUANT unified server on http://localhost:5000...
echo [INFO] Browser will open automatically. Press Ctrl+C to stop.
echo ===================================================

start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5000"

"%PYTHON_EXE%" dashboard\server.py
