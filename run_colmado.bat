@echo off
title ColmadoPro Launcher
echo ===================================================
echo     🏪 COLMADOPRO - INICIANDO APLICACION
echo ===================================================

:: Ensure Node is on PATH
set PATH=C:\Users\pmedina\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64;%PATH%

cd /d "%~dp0colmado-app"

if not exist node_modules (
    echo [*] Instalando dependencias de ColmadoPro...
    call npm install
)

echo [*] Levantando servidor de desarrollo en http://localhost:5175...
call npm run dev
pause

