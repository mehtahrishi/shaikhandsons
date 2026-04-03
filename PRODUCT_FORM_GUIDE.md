# 🚗 Product Registration Form - Complete Field Guide

## ✅ Form Now Matches Database Schema Perfectly

All 35+ database fields are now available in the admin inventory form. Images are optional with automatic placeholder generation.

---

## 📋 Section 1: Basic Information
| Field | Type | Required | Default |
|-------|------|----------|---------|
| Manufacturer (Brand) | Select | ✅ Yes | - |
| Model Name | Text | ✅ Yes | - |
| Model Number/Code | Text | ❌ Optional | - |
| Vehicle Category | Select | ❌ Optional | Scooter/Bike/Loader |
| Ex-Showroom Price (₹) | Number | ✅ Yes | 0 |
| Year | Number | ✅ Yes | 2026 |
| Variant/Trim | Text | ❌ Optional | - |
| Short Description | Text | ❌ Optional | - |

---

## ⚡ Section 2: Technical Specifications
| Field | Type | Required | Options |
|-------|------|----------|---------|
| Top Speed | Text | ❌ Optional | e.g., "45 km/h" |
| Certified Range (ARAI) | Text | ❌ Optional | e.g., "180 km/charge" |
| Real-World Range | Text | ❌ Optional | e.g., "120-150 km" |
| Climbing Degree | Text | ❌ Optional | e.g., "15 Degrees" |
| Load Capacity | Text | ❌ Optional | e.g., "180 kg" |
| Riding Modes | Multi-checkbox | ❌ Optional | Eco, City, Sport, Reverse |

---

## 🔋 Section 3: Battery & Charging
| Field | Type | Required | Options |
|-------|------|----------|---------|
| Battery Type | Select | ❌ Optional | Lithium-ion (NMC), LFP, Lead Graphene |
| Battery Capacity | Text | ❌ Optional | e.g., "60 Ah / 2.5 kWh" |
| Charging Time (0-100%) | Text | ❌ Optional | e.g., "4-5 Hours" |
| Battery Warranty | Text | ❌ Optional | e.g., "3 Years" |
| Charger Details | Text | ❌ Optional | e.g., "10A Smart Charger" |
| Fast Charging Support | Checkbox | ❌ Optional | Yes/No |

---

## 🔧 Section 4: Hardware & Mechanicals
| Field | Type | Required | Options |
|-------|------|----------|---------|
| Motor Power | Text | ❌ Optional | e.g., "1000W BLDC" |
| Braking System | Select | ❌ Optional | Dual Disc, Front Disc/Rear Drum, Regenerative |
| Tyre Type | Select | ❌ Optional | Tubeless, Tube |
| Wheel Type | Select | ❌ Optional | Alloy, Spoke |
| Wheel Size | Text | ❌ Optional | e.g., "10-inch" |
| Ground Clearance | Text | ❌ Optional | e.g., "160 mm" |

---

## 🎨 Section 5: Smart Features & Aesthetics
| Field | Type | Required | Options |
|-------|------|----------|---------|
| Display Type | Select | ❌ Optional | LED Digital, TFT, Touchscreen |
| Boot Space | Text | ❌ Optional | e.g., "20 Liters" |
| Available Colors | Text | ❌ Optional | Comma-separated, e.g., "Red, Blue, Grey" |
| Key Features | Multi-checkbox | ❌ Optional | Anti-theft Alarm, USB Charging, Keyless Entry, Find My Scooter, Projector Headlight, DRL |

---

## 📸 Section 6: Media & Assets

### Images (Optional with Placeholders)
- **Image Upload**: ❌ **Optional** ← NEW!
- **If Images Provided**: Custom images uploaded to storage
- **If No Images**: Auto-generated placeholder images (3 professional placeholders per product)
- **Placeholder Format**: `https://picsum.photos/seed/{make}-{model}-{number}/400/300`

### Design Philosophy
- **Technical Design Philosophy**: Long-form text describing aesthetic and engineering philosophy
- **Character Limit**: Unlimited (stored as text in database)

---

## 🎯 Database Fields Reference

### Current Implementation Status:
✅ **Fully Implemented** - All of these fields are working:
```
id, brand_id, make, model, year, trim, price, model_code, category,
short_description, top_speed, certified_range, real_world_range,
riding_modes, climbing_degree, load_capacity, battery_type,
battery_capacity, charging_time, fast_charging, charger_included,
battery_warranty, motor_power, braking_system, tyre_type, wheel_type,
wheel_size, ground_clearance, display_type, colors, key_features,
boot_space, battery_range_km, horsepower, zero_to_sixty_seconds,
design_philosophy, image_urls, created_at, updated_at
```

---

## 🚀 How to Use

### Quick Product Registration (Minimal Fields Only)
1. Select **Manufacturer (Brand)**
2. Enter **Model Name**
3. Enter **Price**
4. Click **"Register with Placeholders"** ← No image upload needed!

### Complete Product Registration (All Details)
1. Fill in Basic Information (Required: Brand, Model, Price)
2. Fill Technical Specifications
3. Fill Battery & Charging details
4. Fill Hardware specifications
5. Add Colors and Features
6. Upload custom images (optional) OR use auto-generated placeholders
7. Click **"Upload & Register"** or **"Register with Placeholders"**

---

## 🎁 Features Added This Update

| Feature | Description |
|---------|-------------|
| **Optional Images** | No longer required to upload images |
| **Auto Placeholders** | Professional placeholder images generated if not provided |
| **Easier Form** | Minimal required fields for quick registration |
| **Trim Field** | Added Variant/Trim field to basic info section |
| **Better UX** | Button text changes based on image status |
| **All DB Fields** | Every database column is now accessible in the form |

---

## 📊 Database Field Types

| Category | Fields | Type |
|----------|--------|------|
| **Identifiers** | id, brand_id | Integer |
| **Text Fields** | make, model, trim, modelCode, category, etc. | Text/VARCHAR |
| **Numbers** | year, price, horsepower, batteryRangeKm | Integer/Decimal |
| **Arrays** | colors[], keyFeatures[], ridingModes[] | PostgreSQL Array |
| **Booleans** | fastCharging | Boolean |
| **Timestamps** | created_at, updated_at | Timestamp |

---

## 🔗 API Details

**Endpoint**: `POST /api/admin/inventory`

**Required Fields in Request**:
- `brandId` (number)
- `make` (string)
- `model` (string)
- `price` (string/number)

**Optional Fields**: All others (sent if provided, skipped if empty)

**Image Handling**:
- If `imageUrls` array provided: Uses those images
- If empty: Form generates placeholder URLs before sending

---

## ⚠️ Important Notes

1. **Images are Completely Optional**: Just fill the basics and submit!
2. **Placeholder Quality**: Uses picsum.photos (professional random images)
3. **Edit & Bulk Import**: Also support all these fields
4. **Form Sections**: Expandable/Collapsible for easy navigation
5. **Validation**: Only requires Brand, Model, and Price to be filled

---

## 🎯 Next Steps

To create a vehicle now:
1. Go to `/admin/inventory`
2. Click **"Add New Asset"**
3. Fill in minimum fields (Brand, Model, Price)
4. Submit - Done! ✅
