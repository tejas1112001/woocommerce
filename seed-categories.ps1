# PowerShell script to seed categories

$BACKEND_URL = "http://localhost:9000"
$EMAIL = "admin@medusa-test.com"
$PASSWORD = "supersecret"

# Login and get token
Write-Host "Logging in..." -ForegroundColor Cyan
$loginBody = @{
    email = $EMAIL
    password = $PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BACKEND_URL/auth/user/emailpass" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Logged in successfully" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $_" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

# Category data
$categories = @(
    @{
        name = "Men's Clothing"
        handle = "mens-clothing"
        description = "Explore our men's clothing collection"
        children = @(
            @{ name = "T-Shirts"; handle = "mens-tshirts"; description = "Casual and formal t-shirts" },
            @{ name = "Shirts"; handle = "mens-shirts"; description = "Formal and casual shirts" },
            @{ name = "Jeans"; handle = "mens-jeans"; description = "Denim and casual pants" },
            @{ name = "Jackets"; handle = "mens-jackets"; description = "Winter wear and jackets" },
            @{ name = "Sportswear"; handle = "mens-sportswear"; description = "Athletic and gym wear" }
        )
    },
    @{
        name = "Women's Clothing"
        handle = "womens-clothing"
        description = "Discover our women's fashion"
        children = @(
            @{ name = "Dresses"; handle = "womens-dresses"; description = "Casual and party dresses" },
            @{ name = "Tops"; handle = "womens-tops"; description = "Blouses and casual tops" },
            @{ name = "Bottoms"; handle = "womens-bottoms"; description = "Pants, skirts, and shorts" },
            @{ name = "Ethnic Wear"; handle = "womens-ethnic"; description = "Traditional and ethnic clothing" },
            @{ name = "Activewear"; handle = "womens-activewear"; description = "Yoga and gym wear" }
        )
    },
    @{
        name = "Kids' Clothing"
        handle = "kids-clothing"
        description = "Comfortable clothing for kids"
        children = @(
            @{ name = "Boys"; handle = "boys-clothing"; description = "Clothing for boys" },
            @{ name = "Girls"; handle = "girls-clothing"; description = "Clothing for girls" },
            @{ name = "Infants"; handle = "infants-clothing"; description = "Clothing for infants" },
            @{ name = "School Wear"; handle = "school-wear"; description = "School uniforms and wear" }
        )
    },
    @{
        name = "Accessories"
        handle = "accessories"
        description = "Complete your look"
        children = @(
            @{ name = "Bags"; handle = "bags"; description = "Handbags and backpacks" },
            @{ name = "Watches"; handle = "watches"; description = "Stylish timepieces" },
            @{ name = "Jewelry"; handle = "jewelry"; description = "Fashion jewelry" },
            @{ name = "Belts"; handle = "belts"; description = "Leather and casual belts" },
            @{ name = "Sunglasses"; handle = "sunglasses"; description = "UV protection eyewear" }
        )
    },
    @{
        name = "Footwear"
        handle = "footwear"
        description = "Step out in style"
        children = @(
            @{ name = "Men's Shoes"; handle = "mens-shoes"; description = "Formal and casual footwear" },
            @{ name = "Women's Shoes"; handle = "womens-shoes"; description = "Heels, flats, and sandals" },
            @{ name = "Sports Shoes"; handle = "sports-shoes"; description = "Running and training shoes" },
            @{ name = "Sandals"; handle = "sandals"; description = "Comfortable sandals" }
        )
    },
    @{
        name = "Electronics"
        handle = "electronics"
        description = "Latest gadgets and tech"
        children = @(
            @{ name = "Smartphones"; handle = "smartphones"; description = "Latest mobile phones" },
            @{ name = "Laptops"; handle = "laptops"; description = "Computers and notebooks" },
            @{ name = "Headphones"; handle = "headphones"; description = "Audio accessories" },
            @{ name = "Smart Watches"; handle = "smart-watches"; description = "Wearable technology" }
        )
    }
)

$parentCount = 0
$childCount = 0

foreach ($category in $categories) {
    Write-Host "`nCreating parent category: $($category.name)" -ForegroundColor Yellow
    
    $parentBody = @{
        name = $category.name
        handle = $category.handle
        description = $category.description
        is_active = $true
        is_internal = $false
    } | ConvertTo-Json

    try {
        $parentResponse = Invoke-RestMethod -Uri "$BACKEND_URL/admin/product-categories" -Method Post -Body $parentBody -Headers $headers
        $parentId = $parentResponse.product_category.id
        Write-Host "Created: $($category.name)" -ForegroundColor Green
        $parentCount++

        if ($category.children) {
            Write-Host "  Creating $($category.children.Count) subcategories..." -ForegroundColor Cyan
            foreach ($child in $category.children) {
                $childBody = @{
                    name = $child.name
                    handle = $child.handle
                    description = $child.description
                    is_active = $true
                    is_internal = $false
                    parent_category_id = $parentId
                } | ConvertTo-Json

                try {
                    $childResponse = Invoke-RestMethod -Uri "$BACKEND_URL/admin/product-categories" -Method Post -Body $childBody -Headers $headers
                    Write-Host "  Created: $($child.name)" -ForegroundColor Green
                    $childCount++
                } catch {
                    Write-Host "  Failed to create $($child.name): $_" -ForegroundColor Red
                }
            }
        }
    } catch {
        Write-Host "Failed to create $($category.name): $_" -ForegroundColor Red
    }
}

Write-Host "`nCategory seeding completed!" -ForegroundColor Green
Write-Host "Created $parentCount parent categories" -ForegroundColor Cyan
Write-Host "Created $childCount subcategories" -ForegroundColor Cyan
