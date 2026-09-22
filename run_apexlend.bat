@echo off
title ApexLend - Apple White Gallery Financial Suite (Port 5180)
echo =====================================================================
echo  Iniciando ApexLend: Suite de Prestamos Personales y Amortizaciones
echo  Diseno: Apple White Gallery Style
echo  URL: http://localhost:5180
echo =====================================================================
cd /d "%~dp0apexlend\frontend"
if not exist "node_modules" (
    echo [INFO] Creando vinculo de dependencias node_modules...
    mklink /J "node_modules" "..\..\portfolio-pedro-medina\node_modules"
)
npm run dev -- --port 5180 --host
pause
