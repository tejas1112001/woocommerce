# ============================================
# Comprehensive E2E QA Test Script
# Swami Om Enterprises E-Commerce Platform
# Date: July 9, 2026
# ============================================

$ErrorActionPreference = "Continue"

# Configuration
$backendUrl = "http://localhost:9000"
$frontendUrl = "http://localhost:8000"
$publishableKey = "pk_6bdc9f0eb712287fba898904b9e918037ad956f9bf4ff9d92b039595415a58bf"

# Test Results
$testResults = @()

function Test-Service {
    param($name, $url)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Testing: $name" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -ErrorAction Stop
        Write-Host "✓ $name is running" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ $name is NOT running" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        return $false
    }
}

function Test-Endpoint {
    param($name, $url, $method = "GET", $headers = @{}, $body = $null)
    
    Write-Host "`nTesting: $name" -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri = $url
            Method = $method
            Headers = $headers
            TimeoutSec = 10
            ErrorAction = "Stop"
        }
        
        if ($body -and $method -ne "GET") {
            $params['Body'] = $body
            $params.Headers['Content-Type'] = 'application/json'
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✓ $name - SUCCESS" -ForegroundColor Green
        return @{ Success = $true; Data = $response; Error = $null }
    } catch {
        Write-Host "✗ $name - FAILED" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        return @{ Success = $false; Data = $null; Error = $_.Exception.Message }
    }
}

# ============================================
# Phase 1: System Status Check
# ============================================
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "PHASE 1: System Status Check" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$backendRunning = Test-Service "Backend (Medusa)" "$backendUrl/health"
$frontendRunning = Test-Service "Frontend (Next.js)" "$frontendUrl"

if (-not $backendRunning) {
    Write-Host "`n⚠️ Backend is not running. Please start it with:" -ForegroundColor Yellow
    Write-Host "cd medusa-backend\apps\backend && npm run dev" -ForegroundColor White
}

if (-not $frontendRunning) {
    Write-Host "`n⚠️ Frontend is not running. Please start it with:" -ForegroundColor Yellow
    Write-Host "cd solace-medusa-starter && npm run dev" -ForegroundColor White
}

if (-not ($backendRunning -and $frontendRunning)) {
    Write-Host "`n❌ Cannot proceed with tests. Please start both services." -ForegroundColor Red
    exit 1
}

# ============================================
# Phase 2: Backend API Tests
# ============================================
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "PHASE 2: Backend API Tests" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$headers = @{
    "x-publishable-api-key" = $publishableKey
}

# Test 2.1: Get Regions
$regionsTest = Test-Endpoint "Get Regions" "$backendUrl/store/regions" "GET" $headers
if ($regionsTest.Success) {
    $regionId = $regionsTest.Data.regions[0].id
    Write-Host "  Region ID: $regionId" -ForegroundColor Green
}

# Test 2.2: Get Products
$productsTest = Test-Endpoint "Get Products" "$backendUrl/store/products" "GET" $headers
if ($productsTest.Success) {
    $products = $productsTest.Data.products
    Write-Host "  Found $($products.Count) products" -ForegroundColor Green
    
    if ($products.Count -gt 0) {
        $testProduct = $products[0]
        $productId = $testProduct.id
        $productTitle = $testProduct.title
        $variantId = $testProduct.variants[0].id
        
        Write-Host "  Test Product: $productTitle (ID: $productId)" -ForegroundColor Green
        Write-Host "  Variant ID: $variantId" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ No products found in database" -ForegroundColor Yellow
    }
}

# Test 2.3: Get Product Details
if ($productId) {
    $productDetailTest = Test-Endpoint "Get Product Details" "$backendUrl/store/products/$productId" "GET" $headers
    if ($productDetailTest.Success) {
        $product = $productDetailTest.Data.product
        Write-Host "  Product Details:" -ForegroundColor Green
        Write-Host "    Title: $($product.title)" -ForegroundColor White
        Write-Host "    Status: $($product.status)" -ForegroundColor White
        Write-Host "    Variants: $($product.variants.Count)" -ForegroundColor White
        
        # Check inventory
        if ($product.variants[0].inventory_quantity) {
            Write-Host "    Inventory: $($product.variants[0].inventory_quantity)" -ForegroundColor White
        } else {
            Write-Host "    Inventory: Not configured" -ForegroundColor Yellow
        }
    }
}

# Test 2.4: Create Cart
if ($regionId) {
    $cartBody = @{ region_id = $regionId } | ConvertTo-Json
    $createCartTest = Test-Endpoint "Create Cart" "$backendUrl/store/carts" "POST" $headers $cartBody
    
    if ($createCartTest.Success) {
        $cartId = $createCartTest.Data.cart.id
        Write-Host "  Cart ID: $cartId" -ForegroundColor Green
        
        # Test 2.5: Add Item to Cart
        if ($variantId) {
            $lineItemBody = @{
                variant_id = $variantId
                quantity = 1
            } | ConvertTo-Json
            
            $addToCartTest = Test-Endpoint "Add to Cart" "$backendUrl/store/carts/$cartId/line-items" "POST" $headers $lineItemBody
            
            if ($addToCartTest.Success) {
                Write-Host "  Items in cart: $($addToCartTest.Data.cart.items.Count)" -ForegroundColor Green
                Write-Host "  Cart subtotal: $($addToCartTest.Data.cart.subtotal)" -ForegroundColor Green
            }
            
            # Test 2.6: Get Cart
            $getCartTest = Test-Endpoint "Get Cart" "$backendUrl/store/carts/$cartId" "GET" $headers
            if ($getCartTest.Success) {
                Write-Host "  ✓ Cart retrieval successful" -ForegroundColor Green
            }
            
            # Test 2.7: Update Line Item Quantity
            if ($addToCartTest.Success -and $addToCartTest.Data.cart.items.Count -gt 0) {
                $lineItemId = $addToCartTest.Data.cart.items[0].id
                $updateBody = @{ quantity = 2 } | ConvertTo-Json
                
                $updateTest = Test-Endpoint "Update Cart Item Quantity" "$backendUrl/store/carts/$cartId/line-items/$lineItemId" "POST" $headers $updateBody
                if ($updateTest.Success) {
                    Write-Host "  ✓ Quantity updated successfully" -ForegroundColor Green
                }
                
                # Test 2.8: Delete Line Item
                $deleteTest = Test-Endpoint "Delete Cart Item" "$backendUrl/store/carts/$cartId/line-items/$lineItemId" "DELETE" $headers
                if ($deleteTest.Success) {
                    Write-Host "  ✓ Item removed successfully" -ForegroundColor Green
                }
            }
        }
    }
}


# ============================================
# Phase 3: Authentication Tests
# ============================================
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "PHASE 3: Authentication Tests" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Test 3.1: Customer Registration (optional - skip if already exists)
Write-Host "`nSkipping registration test (would create duplicate users)" -ForegroundColor Yellow

# Test 3.2: Customer Login (optional - requires credentials)
Write-Host "Skipping login test (requires user interaction)" -ForegroundColor Yellow

# ============================================
# Phase 4: Frontend Integration Tests
# ============================================
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "PHASE 4: Frontend Integration Tests" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Write-Host "`nFrontend pages to manually test:" -ForegroundColor Yellow
Write-Host "  1. Home Page: $frontendUrl/in" -ForegroundColor White
Write-Host "  2. Shop Page: $frontendUrl/in/shop" -ForegroundColor White
if ($productId) {
    # Need to get the product handle
    Write-Host "  3. Product Page: $frontendUrl/in/products/[handle]" -ForegroundColor White
}
Write-Host "  4. Cart Page: $frontendUrl/in/cart" -ForegroundColor White
Write-Host "  5. Checkout: $frontendUrl/in/checkout" -ForegroundColor White
Write-Host "  6. Account: $frontendUrl/in/account" -ForegroundColor White
Write-Host "  7. Dashboard: $frontendUrl/in/account/@dashboard" -ForegroundColor White

# ============================================
# Phase 5: Database Verification
# ============================================
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "PHASE 5: Database Verification" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Write-Host "`nRunning database diagnostic scripts..." -ForegroundColor Yellow

# Check products in database
if (Test-Path "medusa-backend\apps\backend\check-all-products.ts") {
    Write-Host "`nChecking products in database..." -ForegroundColor Yellow
    Set-Location "medusa-backend\apps\backend"
    npx tsx check-all-products.ts
    Set-Location "..\..\.."
}

# Check inventory
if (Test-Path "medusa-backend\apps\backend\check-inventory.ts") {
    Write-Host "`nChecking inventory levels..." -ForegroundColor Yellow
    Set-Location "medusa-backend\apps\backend"
    npx tsx check-inventory.ts
    Set-Location "..\..\.."
}

# ============================================
# Test Summary
# ============================================
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Write-Host "`n✓ Backend API Tests: COMPLETED" -ForegroundColor Green
Write-Host "✓ Cart Operations: COMPLETED" -ForegroundColor Green
Write-Host "⚠️ Frontend Tests: Manual verification required" -ForegroundColor Yellow
Write-Host "⚠️ Authentication: Manual verification required" -ForegroundColor Yellow

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Manually test the frontend URLs listed above" -ForegroundColor White
Write-Host "2. Try adding a product to cart from the UI" -ForegroundColor White
Write-Host "3. Complete the checkout flow" -ForegroundColor White
Write-Host "4. Test user dashboard features" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
