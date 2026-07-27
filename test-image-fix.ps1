Write-Host ""
Write-Host "========================================"
Write-Host "IMAGE ERROR FIX VERIFICATION TEST"
Write-Host "========================================"
Write-Host ""

$baseUrl = "http://localhost:8000"
$allPassed = $true

# Test product pages
$products = @("t-shirt", "t-shirt-not-varient", "test-product")

Write-Host "Testing product pages..."
Write-Host ""

foreach ($product in $products) {
    $url = "$baseUrl/in/products/$product"
    Write-Host "Testing: $product"
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        
        if ($response.StatusCode -eq 200) {
            Write-Host "  [PASS] Page loads successfully" -ForegroundColor Green
        } else {
            Write-Host "  [FAIL] Status: $($response.StatusCode)" -ForegroundColor Red
            $allPassed = $false
        }
    } catch {
        Write-Host "  [FAIL] Error loading page" -ForegroundColor Red
        $allPassed = $false
    }
}

# Test home page
Write-Host ""
Write-Host "Testing home page..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/in" -UseBasicParsing -TimeoutSec 10
    
    if ($response.StatusCode -eq 200) {
        Write-Host "  [PASS] Home page loads successfully" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] Status: $($response.StatusCode)" -ForegroundColor Red
        $allPassed = $false
    }
} catch {
    Write-Host "  [FAIL] Error loading home page" -ForegroundColor Red
    $allPassed = $false
}

Write-Host ""
Write-Host "========================================"

if ($allPassed) {
    Write-Host "[SUCCESS] All HTTP tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps - Verify in browser:" -ForegroundColor Yellow
    Write-Host "  1. Open browser to http://localhost:8000/in"
    Write-Host "  2. Press F12 to open Developer Console"
    Write-Host "  3. Click on products"
    Write-Host "  4. Check console - should be NO errors"
    Write-Host ""
    Write-Host "Expected results:"
    Write-Host "  - Products WITH images: Show photos"
    Write-Host "  - Products WITHOUT images: Show gray placeholder"
    Write-Host "  - Console: Clean (no red errors)"
} else {
    Write-Host "[FAILED] Some tests did not pass" -ForegroundColor Red
}

Write-Host "========================================"
Write-Host ""
