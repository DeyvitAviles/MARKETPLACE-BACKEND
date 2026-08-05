@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando dependencias de Vue...
  call npm install
)
echo Iniciando web...
call npm run dev
pause
