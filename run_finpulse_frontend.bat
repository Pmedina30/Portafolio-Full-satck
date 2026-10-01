@echo off
title FinPulse - Corporate Expense Audit & Anomaly Detection (Port 5179)
echo =====================================================================
echo  Iniciando FinPulse: Auditoria de Gastos y Deteccion de Anomalias
echo  URL: http://localhost:5179
echo =====================================================================
cd /d "%~dp0finpulse\frontend"
if not exist "node_modules" (
    echo [INFO] Creando vinculo de dependencias node_modules...
    mklink /J "node_modules" "..\..\portfolio-pedro-medina\node_modules"
)
npm run dev -- --port 5179 --host
pause

