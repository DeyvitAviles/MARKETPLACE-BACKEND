@echo off
cd /d "%~dp0Marketplace-backend"
if not exist node_modules (
  echo Instalando dependencias del backend...
  call npm install
)
echo Iniciando backend en http://54.157.69.153
call npm start
pause
