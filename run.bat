@echo off
setlocal
echo ===================================================
echo   Starting PyStack Web Application
echo ===================================================

cd /d "%~dp0"

IF NOT EXIST ".venv\Scripts\python.exe" (
    echo [INFO] Virtual environment not found. Creating .venv...
    set "PY_CMD=python"
    where python >nul 2>nul
    IF ERRORLEVEL 1 (
        IF EXIST "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
            set "PY_CMD=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
        )
    )
    "%PY_CMD%" -m venv .venv
    IF ERRORLEVEL 1 (
        echo [ERROR] Failed to create virtual environment. Ensure Python is installed.
        pause
        exit /b 1
    )
    echo [INFO] Installing required dependencies...
    .venv\Scripts\pip.exe install -r requirements.txt
)

echo.
echo [INFO] Server starting at: http://127.0.0.1:5000
echo [INFO] Demo credentials:
echo        Email:    demo@example.com
echo        Password: password123
echo.
echo Press CTRL+C in this terminal to stop the server.
echo.

.venv\Scripts\python.exe app.py
pause

