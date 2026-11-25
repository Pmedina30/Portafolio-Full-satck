@echo off
title TiendaRD - Cross-Border E-Commerce Platform (USA to Dominican Republic)
echo =====================================================================
echo  TIENDARD -- USA TO DOMINICAN REPUBLIC E-COMMERCE PLATFORM
echo  URL: http://localhost:3000
echo =====================================================================
echo.
cd /d "%~dp0tiendard"
echo [*] Abriendo navegador en http://localhost:3000 ...
start http://localhost:3000
echo [*] Iniciando servidor de desarrollo en puerto 3000...
cmd /c npm run dev
pause
