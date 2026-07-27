# Cleanup diagnostic and test files created during audit

Write-Host "🧹 Cleaning up diagnostic files..." -ForegroundColor Yellow

$filesToRemove = @(
    "medusa-backend\apps\backend\check-sales-channel.ts",
    "medusa-backend\apps\backend\fix-sales-channel-links.ts",
    "test-product-flow.ts",
    "test-product-flow-simple.js"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed: $file" -ForegroundColor Green
    } else {
        Write-Host "  - Not found: $file" -ForegroundColor Gray
    }
}

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
Write-Host "`nKept files:" -ForegroundColor Cyan
Write-Host "  - PRODUCT_FLOW_AUDIT_REPORT.md (Full audit documentation)"
Write-Host "  - cleanup-diagnostic-files.ps1 (This cleanup script)"
