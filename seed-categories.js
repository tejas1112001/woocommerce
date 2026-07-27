// Seed script to create sample categories with proper hierarchy
const axios = require('axios');

const BACKEND_URL = 'http://localhost:9000';

// Sample category hierarchy
const categories = [
  {
    name: "Men's Clothing",
    handle: "mens-clothing",
    description: "Explore our men's clothing collection",
    children: [
      { name: "T-Shirts", handle: "mens-tshirts", description: "Casual and formal t-shirts" },
      { name: "Shirts", handle: "mens-shirts", description: "Formal and casual shirts" },
      { name: "Jeans", handle: "mens-jeans", description: "Denim and casual pants" },
      { name: "Jackets", handle: "mens-jackets", description: "Winter wear and jackets" },
      { name: "Sportswear", handle: "mens-sportswear", description: "Athletic and gym wear" }
    ]
  },
  {
    name: "Women's Clothing",
    handle: "womens-clothing",
    description: "Discover our women's fashion",
    children: [
      { name: "Dresses", handle: "womens-dresses", description: "Casual and party dresses" },
      { name: "Tops", handle: "womens-tops", description: "Blouses and casual tops" },
      { name: "Bottoms", handle: "womens-bottoms", description: "Pants, skirts, and shorts" },
      { name: "Ethnic Wear", handle: "womens-ethnic", description: "Traditional and ethnic clothing" },
      { name: "Activewear", handle: "womens-activewear", description: "Yoga and gym wear" }
    ]
  },
  {
    name: "Kids' Clothing",
    handle: "kids-clothing",
    description: "Comfortable clothing for kids",
    children: [
      { name: "Boys", handle: "boys-clothing", description: "Clothing for boys" },
      { name: "Girls", handle: "girls-clothing", description: "Clothing for girls" },
      { name: "Infants", handle: "infants-clothing", description: "Clothing for infants" },
      { name: "School Wear", handle: "school-wear", description: "School uniforms and wear" }
    ]
  },
  {
    name: "Accessories",
    handle: "accessories",
    description: "Complete your look",
    children: [
      { name: "Bags", handle: "bags", description: "Handbags and backpacks" },
      { name: "Watches", handle: "watches", description: "Stylish timepieces" },
      { name: "Jewelry", handle: "jewelry", description: "Fashion jewelry" },
      { name: "Belts", handle: "belts", description: "Leather and casual belts" },
      { name: "Sunglasses", handle: "sunglasses", description: "UV protection eyewear" }
    ]
  },
  {
    name: "Footwear",
    handle: "footwear",
    description: "Step out in style",
    children: [
      { name: "Men's Shoes", handle: "mens-shoes", description: "Formal and casual footwear" },
      { name: "Women's Shoes", handle: "womens-shoes", description: "Heels, flats, and sandals" },
      { name: "Sports Shoes", handle: "sports-shoes", description: "Running and training shoes" },
      { name: "Sandals", handle: "sandals", description: "Comfortable sandals" }
    ]
  },
  {
    name: "Electronics",
    handle: "electronics",
    description: "Latest gadgets and tech",
    children: [
      { name: "Smartphones", handle: "smartphones", description: "Latest mobile phones" },
      { name: "Laptops", handle: "laptops", description: "Computers and notebooks" },
      { name: "Headphones", handle: "headphones", description: "Audio accessories" },
      { name: "Smart Watches", handle: "smart-watches", description: "Wearable technology" }
    ]
  }
];

async function login() {
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/user/emailpass`, {
      email: 'admin@medusa-test.com',
      password: 'supersecret'
    });
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function createCategory(token, categoryData, parentId = null) {
  try {
    const payload = {
      name: categoryData.name,
      handle: categoryData.handle,
      description: categoryData.description || '',
      is_active: true,
      is_internal: false,
      ...(parentId && { parent_category_id: parentId })
    };

    const response = await axios.post(
      `${BACKEND_URL}/admin/product-categories`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log(`✅ Created category: ${categoryData.name}`);
    return response.data.product_category;
  } catch (error) {
    console.error(`❌ Failed to create category ${categoryData.name}:`, 
      error.response?.data || error.message);
    return null;
  }
}

async function seedCategories() {
  try {
    console.log('🔐 Logging in...');
    const token = await login();
    console.log('✅ Logged in successfully\n');

    for (const category of categories) {
      console.log(`\n📁 Creating parent category: ${category.name}`);
      const parentCategory = await createCategory(token, {
        name: category.name,
        handle: category.handle,
        description: category.description
      });

      if (parentCategory && category.children) {
        console.log(`  📂 Creating ${category.children.length} subcategories...`);
        for (const child of category.children) {
          await createCategory(token, child, parentCategory.id);
        }
      }
    }

    console.log('\n\n✨ Category seeding completed!');
    console.log(`📊 Created ${categories.length} parent categories`);
    console.log(`📊 Created ${categories.reduce((sum, cat) => sum + (cat.children?.length || 0), 0)} subcategories`);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedCategories();
