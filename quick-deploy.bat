@echo off
cd /d "C:\Users\ARYAN SINGH JADAUN\Documents\Projects@Me\Legally 2.0\Legally"
echo === Git Add ===
git add admin-backend/
git add deploy-backend.ps1 deploy.ps1
echo.
echo === Git Commit ===
git commit -m "Fix backend: Add test handler and landing page"
echo.
echo === Git Push ===
git push
echo.
echo === Done! ===
echo Wait 2 minutes then test: https://legallybackend.vercel.app/
pause
