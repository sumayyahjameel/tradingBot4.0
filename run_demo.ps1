# APEX-QUANT Hackathon Live Demo Launcher (PowerShell)
# Launches unified Flask backend + compiled React frontend on http://localhost:5000

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   APEX-QUANT HACKATHON LIVE DEMO LAUNCHER" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. Verify frontend build
$distIndex = Join-Path $ScriptDir "frontend\dist\index.html"
if (-not (Test-Path $distIndex)) {
    Write-Host "[INFO] Building React Vite production bundle..." -ForegroundColor Yellow
    Push-Location (Join-Path $ScriptDir "frontend")
    npm run build
    Pop-Location
} else {
    Write-Host "[OK] Production React bundle ready in frontend/dist" -ForegroundColor Green
}

# 2. Locate Python executable
$pythonExe = "python"
if (Test-Path (Join-Path $ScriptDir "venv\Scripts\python.exe")) {
    $pythonExe = Join-Path $ScriptDir "venv\Scripts\python.exe"
} elseif (Test-Path (Join-Path $ScriptDir "..\venv\Scripts\python.exe")) {
    $pythonExe = Join-Path $ScriptDir "..\venv\Scripts\python.exe"
}

Write-Host "[OK] Using Python environment: $pythonExe" -ForegroundColor Green

# 3. Environment settings
$env:PORT = "5000"
$env:HOST = "127.0.0.1"
$env:PYTHONUNBUFFERED = "1"

Write-Host "[INFO] Starting unified server on http://localhost:5000..." -ForegroundColor Yellow
Write-Host "[INFO] Browser will open automatically. Press Ctrl+C to terminate." -ForegroundColor Cyan

Start-Job -ScriptBlock {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:5000"
} | Out-Null

& $pythonExe "dashboard\server.py"
