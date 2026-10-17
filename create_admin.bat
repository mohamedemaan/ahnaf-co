@echo off
echo ==========================================
echo   Checking and Creating Admin Credentials
echo ==========================================
cd /d "%~dp0"
node server/seedAdmin.js
echo.
pause

