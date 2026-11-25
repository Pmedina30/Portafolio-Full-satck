@echo off
title taxi. — Panel de Operaciones y Monitoreo en Tiempo Real (Santo Domingo)
cd /d "%~dp0taxi-dashboard"
echo ===============================================================================
echo            TAXI. -- REAL-TIME OPERATIONS ^& DISPATCH INTELLIGENCE
echo                  SANTO DOMINGO, REPUBLICA DOMINICANA
echo ===============================================================================
echo.
echo [*] Iniciando servidor de operaciones Vite en puerto 5182...
echo [*] Abriendo http://localhost:5182 en tu navegador...
echo.
start http://localhost:5182
npm.cmd run dev -- --port 5182 --host
pause
