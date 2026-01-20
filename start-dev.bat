@echo off
REM Script para ejecutar Frontend y Backend juntos en Windows

cls
echo ======================================
echo  COMIDA CUBANA - Desarrollo Local
echo ======================================
echo.
echo Iniciando Frontend (3001) y Backend (3000)...
echo.

cd /d "%~dp0"

REM Ejecutar npm run dev desde la raíz
call npm run dev

pause
