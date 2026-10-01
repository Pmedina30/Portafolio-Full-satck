@echo off
title CVForge Studio - Apple White Gallery Resume Platform (Port 5180)
echo =====================================================================
echo  CVFORGE STUDIO -- APPLE WHITE GALLERY RESUME PLATFORM
echo  URL: http://localhost:5180
echo =====================================================================
echo.
cd /d "%~dp0cvforge-studio"
if not exist "node_modules" (
    echo [INFO] Creando vinculo de dependencias node_modules...
    mklink /J "node_modules" "..\portfolio-pedro-medina\node_modules"
)
echo [*] Iniciando servidor Vite en puerto 5180...
echo [*] Abriendo navegador en http://localhost:5180 ...
start http://localhost:5180
cmd /c npm run dev -- --port 5180 --host
pause
