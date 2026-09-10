@echo off
setlocal enabledelayedexpansion
echo =================================================================
echo        NEXUS-01 - 3D Scroll-Animated Tech Store Launcher
echo             Three.js WebGL + React + Tailwind CSS
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

:: 2. Check Node modules in nexus-tech-3d
if not exist "nexus-tech-3d\node_modules" (
    echo [INFO] Installing Three.js, React, and Tailwind dependencies...
    cd nexus-tech-3d
    call npm install
    cd ..
)

echo.
echo [INFO] Starting NEXUS-01 3D Tech Store on http://localhost:5174 ...
echo.
cd nexus-tech-3d
call npm run dev
pause

