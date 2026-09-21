@echo off
title Pedro Medina - Modern Interactive Portfolio (Lightswind UI)
cd /d "%~dp0\portfolio-pedro-medina"
echo ===============================================================================
echo            PEDRO MEDINA -- QUALITY & DATA ANALYST ^| FULL STACK ENGINEER
echo                    LIGHTSWIND UI DARK MINIMALIST PORTFOLIO
echo ===============================================================================
echo.
echo [*] Iniciando servidor Vite en puerto 5177...
echo [*] Abriendo http://localhost:5177 en tu navegador...
echo.
start http://localhost:5177
.\node_modules\.bin\vite.cmd --port 5177 --host
pause

