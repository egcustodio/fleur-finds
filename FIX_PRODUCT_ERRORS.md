# Fix Product Add/Edit Errors - Complete Guide

## Issue
Error message: "Error saving product. Please try again." when adding products in admin.

## Root Cause
The issue can be caused by:
1. Missing or incorrect RLS (Row Level Security) policies
2. Authentication not properly verified
3. Missing database columns
4. Invalid data validation

## Solutions Implemented

### 1. Enhanced Error Handling ✅

**Before**: Generic error message
```typescript
toast.error("Error saving product. Please try again.");
```

**After**: Detailed error messages
```typescript
if (error?.message) {
  toast.error(`Error: ${error.message}`);
} else if (error?.code) {
  toast.error(`Database error (${error.code}). Please check permissions.`);
}
```

**Benefits**:
- Shows exact error from database
- Displays error code for debugging
- Helps identify permission issues
- Better user feedback

---

### 2. Data Validation ✅

Added validation before saving:

```typescript
// Check required fields
if (!formData.title || !formData.price) {
  toast.error("Please fill in all required fields");
  return;
}

// Validate price
if (isNaN(productData.price) || productData.price <= 0) {
  toast.error("Please enter a valid price");
  return;
}
```

**Prevents**:
- Empty title or price
- Invalid price values
- NaN (Not a Number) errors
- Negative prices

---

### 3. Improved Data Formatting ✅

**Before**:
```typescript
quantity: formData.quantity,
order: formData.order,
```

**After**:
```typescript
quantity: parseInt(formData.quantity?.toString() || "0"),
order: parseInt(formData.order?.toString() || "0"),
description: formData.description || "",
category: formData.category || "",
```

**Fixes**:
- Ensures integers are properly parsed
- Handles undefined values
- Provides default empty strings
- Prevents type mismatch errors

---

### 4. Enhanced Logging ✅

Added console logging for debugging:

```typescript
console.log("Saving product:", productData);
console.log("Product added successfully:", data);
console.error("Insert error details:", error);
```

**Benefits**:
- See exact data being sent
- Verify successful operations
- Debug errors in browser console
- Track data flow

---

## Database Fix Script

Created **`fix-products-policies.sql`** with:

### Features:
1. **Verifies table structure**
   - Adds missing columns if needed
   - quantity, in_stock, featured, order

2. **Drops old policies**
   - Removes conflicting policies
   - Prevents policy errors

3. **Creates new policies**
   - SELECT: Anyone can view
   - INSERT: Authenticated users only
   - UPDATE: Authenticated users only
   - DELETE: Authenticated users only

4. **Grants permissions**
   - Full access to authenticated role
   - Sequence usage for IDs

### How to Run:

1. Go to **Supabase Dashboard**
2. Click **SQL Editor**
3. Click **New Query**
4. Copy all content from `fix-products-policies.sql`
5. Paste into editor
6. Click **Run**
7. Should see success message
8. Verify policies created (query at bottom runs automatically)

---

## Testing Steps

### 1. Run Database Fix
- [ ] Run `fix-products-policies.sql` in Supabase
- [ ] Verify success message
- [ ] Check policies were created

### 2. Test Login
- [ ] Go to `/admin/login`
- [ ] Login with admin credentials
- [ ] Ensure redirected to dashboard

### 3. Test Add Product
- [ ] Go to `/admin/products`
- [ ] Click "Add Product"
- [ ] Fill in:
  - Title: "Test Product"
  - Description: "Test description"
  - Price: 99.99
  - Category: "Test"
  - Quantity: 10
- [ ] Click "Add Product"
- [ ] Check browser console for logs
- [ ] Should see: "Saving product:" log
- [ ] Should see success toast OR detailed error
- [ ] If error, note the exact message

### 4. Check Console Errors
Open browser console (F12) and look for:
- Red errors
- "Error details:" logs
- Database error codes
- Permission errors

---

## Common Errors & Solutions

### Error: "new row violates row-level security policy"
**Cause**: RLS policy not allowing insert
**Fix**: Run `fix-products-policies.sql`

### Error: "permission denied for table products"
**Cause**: User role doesn't have permissions
**Fix**: Run GRANT commands in SQL script

### Error: "column 'quantity' does not exist"
**Cause**: Missing database columns
**Fix**: Run table structure checks in SQL script

### Error: "Please log in to save products"
**Cause**: Not authenticated
**Fix**: Logout and login again at `/admin/login`

### Error: "Please enter a valid price"
**Cause**: Price is 0, negative, or not a number
**Fix**: Enter valid price (e.g., 99.99)

### Error: "Please fill in all required fields"
**Cause**: Title or Price is empty
**Fix**: Fill in both Title and Price

---

## Code Changes

### File Modified: `src/app/admin/products/page.tsx`

#### Changes:
1. **Added validation**
   - Required fields check
   - Price validation
   - Number parsing

2. **Enhanced error handling**
   - Detailed error messages
   - Error code display
   - Console logging

3. **Improved data formatting**
   - parseInt for numbers
   - Default empty strings
   - Safe optional chaining

4. **Better debugging**
   - Log data before save
   - Log success response
   - Log error details

---

## Files Created

1. **fix-products-policies.sql**
   - Complete RLS policy fix
   - Table structure verification
   - Permission grants
   - Policy verification query

2. **FIX_PRODUCT_ERRORS.md** (this file)
   - Complete troubleshooting guide
   - Testing checklist
   - Common errors and solutions

---

## Debugging Checklist

If still getting errors after running SQL fix:

- [ ] Open browser console (F12)
- [ ] Clear console
- [ ] Try adding product
- [ ] Copy entire error message
- [ ] Check for:
  - Database error code
  - RLS policy name
  - Column name issues
  - Permission errors
- [ ] Verify user is logged in:
  - Check `/admin/login` redirects to dashboard
  - Look for user data in console
- [ ] Check Supabase Dashboard:
  - Authentication → Users (verify admin exists)
  - Table Editor → products (verify table structure)
  - Database → Policies (verify RLS policies)

---

## Expected Behavior After Fix

### Adding Product:
1. Click "Add Product"
2. Fill in form
3. Click "Add Product" button
4. See in console: "Saving product: {...}"
5. See success toast: "Product added successfully!"
6. See in console: "Product added successfully: [{...}]"
7. Form closes
8. Product appears in list

### If Still Errors:
1. Exact error message shows (not generic)
2. Console shows detailed error
3. Can identify exact issue
4. Can report specific error code

---

## Prevention

To prevent future errors:
- Always run database migrations
- Keep RLS policies updated
- Test authentication flow
- Validate data before submit
- Check console for warnings
- Use detailed error messages
- Log important operations

---

**Status**: ✅ Enhanced error handling + SQL fix script created
**Next Step**: Run `fix-products-policies.sql` in Supabase
**Last Updated**: February 12, 2026
