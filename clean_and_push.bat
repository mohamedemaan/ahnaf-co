@echo off
echo ==========================================
echo   Cleaning git cache and pushing to GitHub
echo ==========================================
cd /d "%~dp0"

echo [1/4] Removing any tracked node_modules from git cache...
git rm -r --cached server/node_modules 2>nul
git rm -r --cached client/client/node_modules 2>nul
git rm -r --cached admin/node_modules 2>nul
git rm -r --cached node_modules 2>nul

echo [2/4] Adding updated files...
git add .

echo [3/4] Committing...
git commit -m "fix: link all frontend pages to live Render backend API with permanent cloud fallback"

echo [4/4] Pushing to GitHub...
git push origin main

echo.
echo ==========================================
echo   Done! Press any key to close.
echo ==========================================
pause

