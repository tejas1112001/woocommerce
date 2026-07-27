# Test Add to Cart Flow via API
Write-Host "Testing Add to Cart Flow" -ForegroundColor Cyan
Write-Host ""

$publishableKey = "pk_6bdc9f0eb712287fba898904b9e918037ad956f9bf4ff9d92b039595415a58bf"
$backendUrl = "http://localhost:9000"
$productId = "prod_01KX35C55WSZREQSYXK5W07DBG"
$variantId = "variant_01KX35C5EKRBRXVN4MWDZJT5P9"

Write-Host "1. Getting product..." -ForegroundColor Yellow
$product = Invoke-RestMethod -Uri "$backendUrl/store/products/$productId" -Headers @{"x-publishable-api-key" = $publishableKey}
Write-Host "   Product: $($product.product.title)" -ForegroundColor Green

Write-Host "2. Getting regions..." -ForegroundColor Yellow
$regions = Invoke-RestMethod -Uri "$backendUrl/store/regions" -Headers @{"x-publishable-api-key" = $publishableKey}
$regionId = $regions.regions[0].id
Write-Host "   Region: $($regions.regions[0].name)" -ForegroundColor Green

Write-Host "3. Creating cart..." -ForegroundColor Yellow
$cartBody = @{region_id = $regionId} | ConvertTo-Json
$cart = Invoke-RestMethod -Uri "$backendUrl/store/carts" -Method POST -Headers @{"x-publishable-api-key" = $publishableKey; "Content-Type" = "application/json"} -Body $cartBody
Write-Host "   Cart ID: $($cart.cart.id)" -ForegroundColor Green

Write-Host "4. Adding to cart..." -ForegroundColor Yellow
$itemBody = @{variant_id = $variantId; quantity = 1} | ConvertTo-Json
$result = Invoke-RestMethod -Uri "$backendUrl/store/carts/$($cart.cart.id)/line-items" -Method POST -Headers @{"x-publishable-api-key" = $publishableKey; "Content-Type" = "application/json"} -Body $itemBody
Write-Host "   SUCCESS! Items: $($result.cart.items.Count)" -ForegroundColor Green

Write-Host ""
Write-Host "Add to Cart API Test PASSED!" -ForegroundColor Green
