# Fix T-Shirt inventory management
Write-Host "`n🔧 Fixing T-Shirt inventory management..." -ForegroundColor Cyan
Write-Host "This will enable 'Manage Inventory' for all variants`n" -ForegroundColor Yellow

Set-Location "c:\self_learning\project\medusa-backend\apps\backend"

npx tsx enable-inventory-management.ts

Write-Host "`n✅ Done! Now refresh your Admin UI and check the variants." -ForegroundColor Green
Write-Host "You should now see inventory management options!`n" -ForegroundColor Green
