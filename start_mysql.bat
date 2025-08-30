@echo off
echo Starting MySQL Service...
net start MySQL84
if %errorlevel% equ 0 (
    echo MySQL started successfully!
    echo.
    echo Now you can run: python setup_database_fixed.py
) else (
    echo Failed to start MySQL. Please run this as Administrator.
    echo Or start MySQL manually from Services (services.msc)
)
pause
