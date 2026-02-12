# Product Categories System

## Overview
The Flowertown e-commerce platform now includes a comprehensive category system for organizing products into specific product types.

## Available Categories

### 1. **Bouquets**
Classic flower bouquets for all occasions
- Traditional arrangements
- Mixed flower bouquets
- Single flower type bouquets

### 2. **Customized Bouquets**
Personalized and custom-designed bouquets
- Client-specific arrangements
- Special requests
- Tailored designs

### 3. **Garland/Lei**
Traditional garlands and leis
- Event decorations
- Welcome garlands
- Cultural celebrations

### 4. **Money Bouquet**
Creative money gift arrangements
- Cash bouquets
- Gift money presentations
- Special occasion money gifts

### 5. **Satin Bouquet**
Elegant satin ribbon bouquets
- Non-perishable bouquets
- Keepsake arrangements
- Alternative to fresh flowers

### 6. **Wedding**
Wedding-specific floral arrangements
- Bridal bouquets
- Ceremony decorations
- Reception centerpieces
- Corsages and boutonnieres

## Admin Product Management

### Adding Products with Categories

1. **Navigate to Admin Products Page**
   - Go to `/admin/products`
   - Click "Add Product" button

2. **Select Category**
   - Category field now uses a dropdown selector
   - Choose from 6 predefined categories
   - Category selection is required

3. **Complete Product Details**
   - Title
   - Description
   - Price (₱)
   - Quantity
   - Image upload
   - In Stock toggle
   - Featured toggle
   - Display order

### Category Filtering

The admin products page includes a category filter system:

**Features:**
- **Filter Buttons**: Click any category to filter products
- **Product Count**: Each category shows the number of products
- **"All" View**: See all products across categories
- **Active Indicator**: Selected category highlighted in amber
- **Dynamic Count**: Shows "X of Y products in [Category]"

**Usage:**
1. View all products by default
2. Click a category button to filter
3. Click "All" to return to full catalog view
4. Product count updates automatically

### Category Display

Products display their category:
- **Front-end**: Category badge/tag on product cards
- **Admin**: Category label above product title
- **Filtering**: Products grouped by category

## Front-end Category Behavior

### Product Categories Component

The `ProductCategories` component automatically:
- Extracts unique categories from products
- Displays category filter buttons
- Filters products by selected category
- Shows "All" option by default

**Category Features:**
- Luxury pill-shaped buttons
- Amber accent for active category
- Smooth transitions
- Mobile-responsive design

### Product Detail Pages

Each product shows:
- Category badge
- Category-specific styling
- Related products from same category (optional)

## Technical Implementation

### Database Schema

```sql
-- Products table includes category column
category: text (required)
```

### Category Constants

```typescript
const categories = [
  "All",
  "Bouquets",
  "Customized Bouquets",
  "Garland/Lei",
  "Money Bouquet",
  "Satin Bouquet",
  "Wedding"
];
```

### Frontend Filtering

```typescript
const filteredProducts = selectedCategory === "All" 
  ? products 
  : products.filter(p => p.category === selectedCategory);
```

## Best Practices

### For Administrators

1. **Consistent Categorization**
   - Choose the most appropriate category
   - Don't create duplicate categories
   - Use existing categories when possible

2. **Category Selection**
   - Consider primary product type
   - Wedding items → "Wedding" category
   - Custom requests → "Customized Bouquets"
   - Traditional flowers → "Bouquets"

3. **Product Organization**
   - Balance products across categories
   - Use "Featured" flag for highlights
   - Maintain appropriate inventory levels

### For Developers

1. **Adding New Categories**
   - Update category array in admin page
   - Update dropdown options in form
   - Maintain alphabetical order (except "All")

2. **Category Validation**
   - Category field is required
   - Uses dropdown to prevent typos
   - Consistent naming across platform

3. **Display Customization**
   - Category styling in ProductCategories.tsx
   - Filter UI in admin products page
   - Badge design on product cards

## Category Migration

If you have existing products without categories:

1. **Bulk Update in Supabase**
```sql
-- Update existing products with default category
UPDATE products 
SET category = 'Bouquets' 
WHERE category IS NULL OR category = '';
```

2. **Individual Updates**
   - Edit each product in admin
   - Select appropriate category
   - Save changes

## User Experience

### Customer Benefits

1. **Easy Navigation**
   - Browse by product type
   - Filter by occasion/style
   - Quick category identification

2. **Better Discovery**
   - Find specific product types
   - Explore category collections
   - Compare similar products

3. **Clear Organization**
   - Products grouped logically
   - Category badges for quick identification
   - Filtered search results

### Visual Design

**Category Pills:**
- Rounded full borders
- Amber accent color (matches brand)
- Hover effects
- Active state highlighting
- Product count badges

**Filter UI:**
- Clean, modern design
- Mobile-responsive
- Smooth transitions
- Clear active states

## Future Enhancements

Potential category system improvements:

1. **Subcategories**
   - Wedding → Bridal, Ceremony, Reception
   - Bouquets → Roses, Mixed, Seasonal

2. **Category Images**
   - Hero image per category
   - Category landing pages

3. **Smart Filtering**
   - Multiple category selection
   - Price range + category
   - Availability + category

4. **Analytics**
   - Popular categories
   - Category conversion rates
   - Inventory by category

## Support

For questions about the category system:
- Check this documentation
- Review admin interface
- Test filtering functionality
- Contact development team

---

**Last Updated**: February 12, 2026  
**Version**: 1.0  
**Status**: Active
