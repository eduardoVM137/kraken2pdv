@echo off
rem ===== Kraken POS - Launcher (oculto/auto-restart) =====
setlocal enabledelayedexpansion

rem --- Rutas base ---
set "HERE=%~dp0"
set "LOGDIR=%HERE%logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%"

rem --- Node/NPM (usa los que mostraste en tu captura) ---
set "NODEDIR=C:\Program Files\nodejs"
set "NPM=%NODEDIR%\npm.cmd"
set "NODEVARS=%NODEDIR%\nodevars.bat"

rem --- Si entramos con argumento, vamos directo a esa rutina ---
if /I "%~1"=="api" goto :loopAPI
if /I "%~1"=="web" goto :loopWEB

rem --- Lanzamiento inicial (sin argumentos) ---
echo [LAUNCHER] %date% %time% - Iniciando... > "%LOGDIR%\launcher.log"
echo [LAUNCHER] Using NPM: %NPM% >> "%LOGDIR%\launcher.log"

rem Cargar PATH/entorno de Node por si el proceso corre sin PATH (vbs, tarea programada)
call "%NODEVARS%" >nul 2>&1

rem Re-llamamos ESTE MISMO .cmd con los labels como argumentos
rem Nota: %~f0 es la ruta completa de este batch
start "API_SERVER" cmd /c ""%~f0" api"
start "WEB_SERVER" cmd /c ""%~f0" web"

echo [LAUNCHER] %date% %time% - Lanzado. >> "%LOGDIR%\launcher.log"
exit /b

:loopAPI
call "%NODEVARS%" >nul 2>&1
cd /d "C:\Users\usuario\Documents\proyectos\Nueva carpeta\kraken2pdv\app\backend"
:againAPI
echo [API] %date% %time% Iniciando...>> "%LOGDIR%\api.log"
"%NPM%" start >> "%LOGDIR%\api.log" 2>&1
echo [API] %date% %time% Se cerró, reiniciando en 5s...>> "%LOGDIR%\api.log"
timeout /t 5 >nul
goto againAPI

:loopWEB
call "%NODEVARS%" >nul 2>&1
cd /d "C:\Users\usuario\Documents\proyectos\Nueva carpeta\kraken2pdv\app\frontend\kraken"
:againWEB
echo [WEB] %date% %time% Iniciando...>> "%LOGDIR%\web.log"
"%NPM%" run dev >> "%LOGDIR%\web.log" 2>&1
echo [WEB] %date% %time% Se cerró, reiniciando en 5s...>> "%LOGDIR%\web.log"
timeout /t 5 >nul
goto againWEB
