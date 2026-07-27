# Add inventory to T-Shirt variants
Write-Host "🔧 Adding inventory to T-Shirt variants..." -ForegroundColor Cyan

Set-Location "c:\self_learning\project\medusa-backend\apps\backend"

# Run the script
npx tsx add-tshirt-inventory.ts

Write-Host "`n✅ Done!" -ForegroundColor Green
