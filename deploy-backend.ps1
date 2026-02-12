# Deploy admin-backend test to Vercel
Set-Location "C:\Users\ARYAN SINGH JADAUN\Documents\Projects@Me\Legally 2.0\Legally"

Write-Host "=== Testing basic Vercel deployment ===" -ForegroundColor Cyan

Write-Host "`nAdding changes..." -ForegroundColor Yellow
git add admin-backend/api/index.py

Write-Host "`nCommitting..." -ForegroundColor Yellow
git commit -m "Test: Simple handler without FastAPI imports"

Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host "`n✓ Pushed! Vercel will deploy in 1-2 minutes" -ForegroundColor Green
Write-Host "`nThen test: https://legallybackend.vercel.app/" -ForegroundColor Yellow
Write-Host "Should show: 'Backend is working!'" -ForegroundColor Yellow
