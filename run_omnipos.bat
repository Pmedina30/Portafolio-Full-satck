@echo off
setlocal enabledelayedexpansion
echo =================================================================
echo   OMNIPOS - Cloud Retail & Tech Inventory Command Launcher
echo          Apple iPadOS Split View & macOS Operating System
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

echo.
echo [INFO] Starting OmniPOS Cloud POS & ERP on http://localhost:3001 ...
echo.
cd omnipos
node node_modules\vite\bin\vite.js --port 3001 --host
pause
