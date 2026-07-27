# Comprehensive Fix and Verification Script
# Swami Om Enterprises E-Commerce Platform

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "E2E QA Fix and Verification Script" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

$backendUrl = "http://localhost:9000"
$frontendUrl = "http://localhost:8000"
$publishableKey = "pk_6bdc9f0eb712287fba898904b9e918037ad956f9bf4ff9d92b039595415a58bf"

# Step 1: Check if services are running
Write-Host "Step 1: Checking if services are running..." -ForegroundColor Yellow

try {
    Invoke-RestMethod -Uri "$backendUrl/health" -Method GET | Out-Null
    Write-Host "[OK] Backend is running on port 9000" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Backend is not running!" -ForegroundColor Red
    Write-Host "Please start it with: cd medusa-backend\apps\backend && npm run dev" -ForegroundColor White
    exit 1
}

try {
    Invoke-WebRequest -Uri $frontendUrl -Method GET | Out-Null
    Write-Host "[OK] Frontend is running on port 8000" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Frontend is not running!" -ForegroundColor Red
    Write-Host "Please start it with: cd solace-medusa-starter && npm run dev" -ForegroundColor White
    exit 1
}

# Step 2: Verify Product Configuration
Write-Host "`nStep 2: Verifying product configuration..." -ForegroundColor Yellow

$headers = @{"x-publishable-api-key" = $publishableKey}
$products = Invoke-RestMethod -Uri "$backendUrl/store/products" -Headers $headers

if ($products.products.Count -eq 0) {
    Write-Host "[ERROR] No products found!" -ForegroundColor Red
    Write-Host "Please add products through the admin panel at http://localhost:9000/app" -ForegroundColor White
    exit 1
}

$product = $products.products[0]
Write-Host "[OK] Found product: $($product.title)" -ForegroundColor Green
Write-Host "     Product ID: $($product.id)" -ForegroundColor Gray
Write-Host "     Handle: $($product.handle)" -ForegroundColor Gray
Write-Host "     Status: $($product.status)" -ForegroundColor Gray

if ($product.variants.Count -eq 0) {
    Write-Host "[ERROR] Product has no variants!" -ForegroundColor Red
    exit 1
}

$variantId = $product.variants[0].id
Write-Host "[OK] Product has $($product.variants.Count) variant(s)" -ForegroundColor Green

# Step 3: Test Complete Add to Cart Flow
Write-Host "`nStep 3: Testing complete Add to Cart flow..." -ForegroundColor Yellow

# Get region
$regions = Invoke-RestMethod -Uri "$backendUrl/store/regions" -Headers $headers
$regionId = $regions.regions[0].id
Write-Host "[OK] Region: $($regions.regions[0].name)" -ForegroundColor Green

# Create cart
$cartBody = @{ region_id = $regionId } | ConvertTo-Json
$cartResult = Invoke-RestMethod -Uri "$backendUrl/store/carts" -Method POST -Headers @{"x-publishable-api-key"=$publishableKey; "Content-Type"="application/json"} -Body $cartBody
$cartId = $cartResult.cart.id
Write-Host "[OK] Cart created: $cartId" -ForegroundColor Green

# Add item to cart
try {
    $lineItemBody = @{
        variant_id = $variantId
        quantity = 1
    } | ConvertTo-Json
    
    $addResult = Invoke-RestMethod -Uri "$backendUrl/store/carts/$cartId/line-items" -Method POST -Headers @{"x-publishable-api-key"=$publishableKey; "Content-Type"="application/json"} -Body $lineItemBody
    
    Write-Host "[OK] Item added to cart successfully!" -ForegroundColor Green
    Write-Host "     Cart has $($addResult.cart.items.Count) item(s)" -ForegroundColor Gray
    Write-Host "     Subtotal: $($addResult.cart.subtotal)" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Failed to add item to cart!" -ForegroundColor Red
    Write-Host "     Error: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Verify Frontend Files
Write-Host "`nStep 4: Verifying frontend files..." -ForegroundColor Yellow

$criticalFiles = @(
    "solace-medusa-starter\src\lib\data\cart.ts",
    "solace-medusa-starter\src\modules\products\components\product-actions\index.tsx",
    "solace-medusa-starter\.env.local"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "[OK] $file exists" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] $file not found!" -ForegroundColor Red
    }
}

# Step 5: Check Environment Variables
Write-Host "`nStep 5: Checking environment variables..." -ForegroundColor Yellow

$envFile = "solace-medusa-starter\.env.local"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    
    $requiredVars = @(
        "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
        "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
        "NEXT_PUBLIC_BASE_URL",
        "NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID"
    )
    
    foreach ($var in $requiredVars) {
        if ($envContent -match $var) {
            Write-Host "[OK] $var is set" -ForegroundColor Green
        } else {
            Write-Host "[WARNING] $var is not set" -ForegroundColor Yellow
        }
    }
}

# Step 6: Test URLs
Write-Host "`nStep 6: Frontend URLs to test manually..." -ForegroundColor Yellow
Write-Host "     1. Home:     $frontendUrl/in" -ForegroundColor White
Write-Host "     2. Shop:     $frontendUrl/in/shop" -ForegroundColor White
Write-Host "     3. Product:  $frontendUrl/in/products/$($product.handle)" -ForegroundColor White
Write-Host "     4. Cart:     $frontendUrl/in/cart" -ForegroundColor White
Write-Host "     5. Checkout: $frontendUrl/in/checkout" -ForegroundColor White
Write-Host "     6. Account:  $frontendUrl/in/account" -ForegroundColor White

# Summary
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "VERIFICATION COMPLETE" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan

Write-Host "`nAll backend tests PASSED!" -ForegroundColor Green
Write-Host "The Add to Cart functionality works at the API level." -ForegroundColor Green

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Open the product page in your browser:" -ForegroundColor White
Write-Host "   $frontendUrl/in/products/$($product.handle)" -ForegroundColor Cyan
Write-Host "2. Open browser Developer Tools (F12)" -ForegroundColor White
Write-Host "3. Go to the Console tab" -ForegroundColor White
Write-Host "4. Click 'Add to Cart' button" -ForegroundColor White
Write-Host "5. Check for any error messages in the console" -ForegroundColor White
Write-Host "6. Check the Network tab for failed requests" -ForegroundColor White

Write-Host "`nIf you see errors, please share them for further diagnosis." -ForegroundColor Yellow
Write-Host "`n============================================`n" -ForegroundColor Cyan
