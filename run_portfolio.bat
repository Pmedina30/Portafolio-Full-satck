@echo off
setlocal enabledelayedexpansion
title Pedro Medina — Full-Stack & Operational Data Architect Portfolio (Port 5177)
cd /d "%~dp0"

:: 1. Ensure Node.js is on PATH if installed via WinGet
where node >nul 2>nul
if errorlevel 1 (
    for /d %%D in ("%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS*") do (
        for /d %%N in ("%%D\node-*") do (
            if exist "%%N\node.exe" (
                set "PATH=%%N;!PATH!"
            )
        )
    )
)

echo ===============================================================================
echo      PEDRO MEDINA — FULL-STACK ENGINEER ^& OPERATIONAL DATA ARCHITECT
echo            ARCHITECTURAL MONOGRAPH ^& INTERACTIVE SYSTEM STUDIO
echo ===============================================================================
echo.
echo [*] Starting Portfolio Server on http://localhost:5177 ...
echo [*] Opening http://localhost:5177 in your browser...
echo.
start http://localhost:5177

where node >nul 2>nul
if not errorlevel 1 (
    cd /d "%~dp0\portfolio-pedro-medina"
    node .\node_modules\vite\bin\vite.js --port 5177 --host
) else (
    if exist ".venv\Scripts\python.exe" (
        .venv\Scripts\python.exe -m http.server 5177 --directory "portfolio-pedro-medina\dist"
    ) else (
        python -m http.server 5177 --directory "portfolio-pedro-medina\dist"
    )
)
pause
