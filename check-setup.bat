@echo off
REM Script para verificar que el sistema esté listo para ejecutarse

cls
echo ======================================
echo  VERIFICAR INSTALACION
echo ======================================
echo.

REM Verificar Node.js
echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js instalado: 
    node --version
) else (
    echo ✗ Node.js NO está instalado
    echo   Descárgalo en: https://nodejs.org/
    pause
    exit /b 1
)
echo.

REM Verificar npm
echo [2/4] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ npm instalado: 
    npm --version
) else (
    echo ✗ npm NO está instalado
    pause
    exit /b 1
)
echo.

REM Verificar dependencias raíz
echo [3/4] Verificando dependencias...
if exist "package-lock.json" (
    echo ✓ Dependencias raíz instaladas
) else (
    echo ✗ Dependencias NO instaladas
    echo   Ejecuta: npm install
    pause
    exit /b 1
)
echo.

REM Verificar npm-run-all
echo [4/4] Verificando npm-run-all...
npm list npm-run-all >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ npm-run-all instalado
) else (
    echo ✗ npm-run-all NO está instalado
    echo   Instalando...
    call npm install npm-run-all --save-dev
)
echo.

echo ======================================
echo  ✓ TODO LISTO PARA EMPEZAR
echo ======================================
echo.
echo Para iniciar: npm run dev
echo URL Frontend: http://localhost:3001
echo URL Backend: http://localhost:3000
echo.
pause
