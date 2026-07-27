# Quick API Test Script
$backendUrl = "http://localhost:9000"
$publishableKey = "pk_6bdc9f0eb712287fba898904b9e918037ad956f9bf4ff9d92b039595415a58bf"

Write-Host "Testing Backend Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$backendUrl/health" -Method GET
    Write-Host "✓ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend is not running" -ForegroundColor Red
    exit 1
}

Write-Host "`nTesting Products API..." -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "$backendUrl/store/products" -Method GET -Headers @{"x-publishable-api-key" = $publishableKey}
    Write-Host "✓ Found $($products.products.Count) products" -ForegroundColor Green
    
    if ($products.products.Count -gt 0) {
        $product = $products.products[0]
        Write-Host "  Product: $($product.title)" -ForegroundColor White
        Write-Host "  ID: $($product.id)" -ForegroundColor White
        Write-Host "  Variant ID: $($product.variants[0].id)" -ForegroundColor White
    }
} catch {
    Write-Host "✗ Products API failed: $_" -ForegroundColor Red
}

Write-Host "`nTesting Cart Creation..." -ForegroundColor Yellow
try {
    $regions = Invoke-RestMethod -Uri "$backendUrl/store/regions" -Method GET -Headers @{"x-publishable-api-key" = $publishableKey}
    $regionId = $regions.regions[0].id
    
    $cartBody = @{ region_id = $regionId } | ConvertTo-Json
    $cart = Invoke-RestMethod -Uri "$backendUrl/store/carts" -Method POST -Headers @{"x-publishable-api-key" = $publishableKey; "Content-Type" = "application/json"} -Body $cartBody
    
    Write-Host "✓ Cart created: $($cart.cart.id)" -ForegroundColor Green
} catch {
    Write-Host "✗ Cart creation failed: $_" -ForegroundColor Red
}

Write-Host "`n✓ Basic API tests completed" -ForegroundColor Green
