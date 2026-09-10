@echo off
setlocal enabledelayedexpansion
echo =================================================================
echo        SmileCraft Dental - Full-Stack Application Launcher
echo            React + Tailwind CSS + Python REST Backend
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

:: 2. Add Python to PATH if needed
where python >nul 2>nul
if errorlevel 1 (
    if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
        set "PATH=%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python312\Scripts;!PATH!"
    )
)

:: 3. Check Virtual Environment
set "PY_EXE=.venv\Scripts\python.exe"
if not exist "%PY_EXE%" (
    echo [INFO] Creating Python virtual environment...
    python -m venv .venv
    "%PY_EXE%" -m pip install -r dental-app\backend\requirements.txt
)

:: 4. Check Frontend node_modules
if not exist "dental-app\frontend\node_modules" (
    echo [INFO] Installing frontend dependencies (npm install)...
    cd dental-app\frontend
    call npm install
    cd ..\..
)

echo.
echo [1/2] Starting Python REST API Backend on http://127.0.0.1:5001 ...
start "SmileCraft Dental - Backend" cmd /k "cd /d "%~dp0dental-app\backend" && ..\..\.venv\Scripts\python.exe app.py"

echo [2/2] Starting React + Tailwind Frontend on http://localhost:5173 ...
start "SmileCraft Dental - Frontend" cmd /k "cd /d "%~dp0dental-app\frontend" && npm run dev"

echo.
echo =================================================================
echo  Both services launched successfully!
echo.
echo  🌐 Frontend App:  http://localhost:5173
echo  🦷 Backend API:   http://127.0.0.1:5001/api/health
echo.
echo  Demo Accounts:
echo    - Patient:  patient@smilecraft.com  / smile123
echo    - Dentist:  dr.sarah@smilecraft.com / smile123
echo =================================================================
echo.
echo (You can close this launcher window at any time; servers run in separate windows)
pause

