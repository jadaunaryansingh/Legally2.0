# Deploy script for backend
cd "C:\Users\ARYAN SINGH JADAUN\Documents\Projects@Me\Legally 2.0\Legally"

Write-Host "=== Checking Git Status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Adding Changes ===" -ForegroundColor Cyan
git add admin-backend/

Write-Host "`n=== Committing Changes ===" -ForegroundColor Cyan
git commit -m "Add backend landing page and fix favicon 404 errors"

Write-Host "`n=== Pushing to GitHub ===" -ForegroundColor Cyan
git push

Write-Host "`n=== Done! ===" -ForegroundColor Green
Write-Host "Vercel will auto-deploy in 2-3 minutes"
Write-Host "Visit: https://legallybackend.vercel.app/" -ForegroundColor Yellow
