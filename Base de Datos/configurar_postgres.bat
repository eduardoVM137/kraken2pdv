 @echo off
:: ----------------------------------------------------------
:: Script de configuración automática de PostgreSQL en Windows
:: Detecta versión instalada, copia archivos de configuración
:: y reinicia el servicio. Debe ejecutarse como Administrador.
:: ----------------------------------------------------------

REM Verificar permisos de administrador
net session >nul 2>&1
if %errorlevel% NEQ 0 (
    echo ❌ Este script requiere ejecutar como Administrador.
    pause
    exit /B 1
)

REM Detectar carpeta de instalación de PostgreSQL (versiones múltiples)
set "PGROOT=C:\Program Files\PostgreSQL"
set "DATADIR="
for /D %%D in ("%PGROOT%\*") do (
    if exist "%%D\data" (
        set "DATADIR=%%D\data"
    )
)

if not defined DATADIR (
    echo ❌ No se encontro la carpeta de datos de PostgreSQL en %PGROOT%.
    pause
    exit /B 1
)

echo 📂 Directorio de datos: %DATADIR%

REM Respaldar configuraciones actuales
copy /Y "%DATADIR%\postgresql.conf" "%DATADIR%\postgresql.conf.bak" >nul 2>&1
copy /Y "%DATADIR%\pg_hba.conf" "%DATADIR%\pg_hba.conf.bak" >nul 2>&1

REM Copiar nuevos archivos de configuración (debe estar en la misma carpeta que este script)
copy /Y "%~dp0postgresql.conf" "%DATADIR%\postgresql.conf" >nul 2>&1
copy /Y "%~dp0pg_hba.conf" "%DATADIR%\pg_hba.conf" >nul 2>&1

REM Detectar servicio de PostgreSQL y reiniciarlo
set "SRV="
for /F "tokens=1" %%S in ('sc query state^= all ^| findstr /I "postgresql-"') do (
    set "SRV=%%S"
    goto :restartService
)

echo ❌ No se encontro el servicio de PostgreSQL.
goto :end

:restartService
echo 🔄 Reiniciando servicio !SRV!...
net stop "!SRV!" >nul 2>&1
net start "!SRV!" >nul 2>&1
echo ✅ Servicio !SRV! reiniciado correctamente.

:end
pause
