@echo off
setlocal enabledelayedexpansion
echo =================================================================
echo   COSMOSLENS - Orbital Telemetry & Deep Space Data Explorer
echo         Apple visionOS Spatial Glass Aesthetic + Three.js
echo =================================================================
echo.

cd /d "%~dp0"

:: 1. Add WinGet Node.js to PATH if needed
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

:: 2. Check Node modules in cosmoslens
if not exist "cosmoslens\node_modules\.bin" (
    echo [INFO] Completing dependencies install...
    cd cosmoslens
    call npm.cmd install
    cd ..
)

echo.
echo [INFO] Launching CosmosLens visionOS Experience on http://localhost:3000 ...
echo.
cd cosmoslens
call npm.cmd run dev
pause
