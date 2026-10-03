@echo off
echo ==========================================
echo   Pushing Ahnaf & Co code to GitHub...
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/3] Adding all new files...
git add .

echo [2/3] Committing changes...
git commit -m "feat: implement bank-level secure admin authentication, smart bulk import, and fix product UI"

echo [3/3] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo Trying master branch instead...
    git push origin master
)

echo.
echo ==========================================
echo   Done! Press any key to close.
echo ==========================================
pause
