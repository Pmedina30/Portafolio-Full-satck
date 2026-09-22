@echo off
title PulseOps B2B - Operational Intelligence Dashboard
cd /d "%~dp0\pulseops\frontend"
echo ===============================================================================
echo             PULSEOPS B2B -- REAL-TIME OPERATIONAL INTELLIGENCE
echo                     LINEAR ^& VERCEL AESTHETIC DASHBOARD
echo ===============================================================================
echo.
echo [*] Iniciando servidor Vite en puerto 5178...
echo [*] Abriendo http://localhost:5178 en tu navegador...
echo.
start http://localhost:5178
.\node_modules\.bin\vite.cmd --port 5178 --host
pause

