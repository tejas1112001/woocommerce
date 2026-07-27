# Quick verification script for Medusa product routing

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Medusa v2 Product Routing Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8000"

function Test-Url {
    param($path, $expectedStatus = 200)
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$path" -Method Head -UseBasicParsing -TimeoutSec 5
        $status = $response.StatusCode
        
        if ($status -eq $expectedStatus) {
            Write-Host "[PASS]" -ForegroundColor Green -NoNewline
            Write-Host " $status $path"
            return $true
        } else {
            Write-Host "[FAIL]" -ForegroundColor Red -NoNewline
            Write-Host " Expected $expectedStatus, got $status $path"
            return $false
        }
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq $expectedStatus) {
            Write-Host "[PASS]" -ForegroundColor Green -NoNewline
            Write-Host " $status $path (expected failure)"
            return $true
        } else {
            Write-Host "[FAIL]" -ForegroundColor Red -NoNewline
            Write-Host " Expected $expectedStatus, got $status $path"
            Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
            return $false
        }
    }
}

Write-Host "1. Testing Home Page:" -ForegroundColor Yellow
Test-Url "/in"

Write-Host "`n2. Testing Product List Pages:" -ForegroundColor Yellow
Test-Url "/in/shop"
Test-Url "/in/collections"

Write-Host "`n3. Testing Product Detail Pages:" -ForegroundColor Yellow
Test-Url "/in/products/t-shirt"
Test-Url "/in/products/test-product"
Test-Url "/in/products/t-shirt-not-varient"

Write-Host "`n4. Testing 404 Handling:" -ForegroundColor Yellow
Test-Url "/in/products/non-existent" 404

Write-Host "`n5. Fetching Product Page Content:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/in/products/t-shirt" -UseBasicParsing -TimeoutSec 5
    $html = $response.Content
    
    $title = [regex]::Match($html, '<title>(.*?)</title>').Groups[1].Value
    
    Write-Host "[INFO] Page Title: " -NoNewline
    Write-Host $title -ForegroundColor Cyan
    
    if ($html -match 'T-shirt' -and $html -match 'Add to cart') {
        Write-Host "[PASS]" -ForegroundColor Green -NoNewline
        Write-Host " Product content loads correctly"
    } else {
        Write-Host "[WARN]" -ForegroundColor Yellow -NoNewline
        Write-Host " Product content may be incomplete"
    }
} catch {
    Write-Host "[FAIL]" -ForegroundColor Red -NoNewline
    Write-Host " Could not fetch product page"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Verification Complete!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
