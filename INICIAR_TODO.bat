@echo off
cd /d "%~dp0"
echo Iniciando backend y aplicacion web en ventanas separadas...
start "MarketChat Backend" cmd /k "INICIAR_BACKEND.bat"
timeout /t 3 /nobreak >nul
start "MarketChat Web" cmd /k "INICIAR_WEB.bat"
echo.
echo Backend: http://54.157.69.153:3000
echo Web:     http://54.157.69.153:5173
echo.
pause
