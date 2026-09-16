@echo off
title Executive Dashboard Studio - Aviation IOCC
cd /d "%~dp0\executive-dashboard-studio"
echo ===============================================================================
echo            EXECUTIVE DASHBOARD STUDIO -- AVIATION IOCC INTELLIGENCE
echo ===============================================================================
echo.
echo [*] Iniciando servidor Vite en puerto 5176...
echo [*] Abriendo http://localhost:5176 en tu navegador...
echo.
start http://localhost:5176
.\node_modules\.bin\vite.cmd --port 5176 --host
pause
