-- ============================================================================
-- PostgreSQL Migration: Drop and Recreate Vehicles Table
-- Date: 2026-04-03
-- Purpose: Clean slate for vehicles table with all required columns
-- ============================================================================

-- 1. Drop the existing vehicles table (this will cascade delete any dependent rows)
DROP TABLE IF EXISTS vehicles CASCADE;

-- 2. Recreate the vehicles table with complete schema
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER NOT NULL,
  make VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  trim VARCHAR(255),
  price DECIMAL(12, 2) NOT NULL,
  
  -- Basic Info
  model_code VARCHAR(100),
  category VARCHAR(50), -- Scooter, Bike, Loader
  short_description TEXT,
  
  -- Performance
  top_speed VARCHAR(50),
  certified_range VARCHAR(50),
  real_world_range VARCHAR(100),
  riding_modes TEXT[] DEFAULT '{}',
  climbing_degree VARCHAR(50),
  load_capacity VARCHAR(50),
  
  -- Battery & Charging
  battery_type VARCHAR(100),
  battery_capacity VARCHAR(100),
  charging_time VARCHAR(100),
  fast_charging BOOLEAN DEFAULT false,
  charger_included VARCHAR(255),
  battery_warranty VARCHAR(100),
  
  -- Hardware
  motor_power VARCHAR(100),
  braking_system VARCHAR(100),
  tyre_type VARCHAR(50),
  wheel_type VARCHAR(50),
  wheel_size VARCHAR(50),
  ground_clearance VARCHAR(50),
  
  -- Smart Features & Aesthetics
  display_type VARCHAR(100),
  colors TEXT[] DEFAULT '{}',
  key_features TEXT[] DEFAULT '{}',
  boot_space VARCHAR(50),

  -- Legacy fields (for backward compatibility)
  battery_range_km INTEGER,
  horsepower INTEGER,
  zero_to_sixty_seconds DECIMAL(5, 2),
  design_philosophy TEXT,
  image_urls TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Key
  CONSTRAINT fk_vehicles_brand FOREIGN KEY (brand_id) 
    REFERENCES brands(id) ON DELETE CASCADE
);

-- 3. Create indexes for better query performance
CREATE INDEX idx_vehicles_brand ON vehicles(brand_id);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_category ON vehicles(category);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_model ON vehicles(model);

-- ============================================================================
-- IMPORTANT NOTES:
-- ============================================================================
-- 
-- Columns Data Type Information:
-- - colors: TEXT[] (PostgreSQL Array) - Stores colors as ["Red", "Blue", "Grey"]
--   * Can be queried with: WHERE 'Red' = ANY(colors)
--   * Input format: Comma-separated like "Red, Blue, Grey"
--
-- - colors can be:
--   * NULL (empty)
--   * Empty array: '{}'
--   * Populated array: '{"Red","Blue","Grey"}'
--
-- How the form handles it:
-- * Input: "Red, Blue, Grey"
-- * Processing: .split(',').map(c => c.trim()).filter(Boolean)
-- * Result: ["Red", "Blue", "Grey"]
-- * Storage: '{"Red","Blue","Grey"}' in PostgreSQL
--
-- ============================================================================
-- INSERT TEST DATA (Optional)
-- ============================================================================
-- Uncomment below to verify the table works:
/*
INSERT INTO vehicles (
  brand_id, make, model, year, trim, price,
  model_code, category, short_description,
  top_speed, certified_range, real_world_range,
  riding_modes, climbing_degree, load_capacity,
  battery_type, battery_capacity, charging_time,
  fast_charging, charger_included, battery_warranty,
  motor_power, braking_system, tyre_type, wheel_type,
  wheel_size, ground_clearance,
  display_type, colors, key_features, boot_space,
  design_philosophy, image_urls
) VALUES (
  3, 'Dynamo', 'Lima', 2024, NULL, 70000,
  'LIMA-STD', 'Scooter', 'Affordable low-speed electric scooter',
  '25 km/h', '120 km/charge', '90–100 km/charge',
  '{Eco,City}', '7–10 degrees', '180 kg',
  'Lithium-ion (NMC)', '1.8 kWh', '4–6 hours',
  false, 'Portable charger included', '3 Years',
  '250W', 'Front Disc/Rear Drum', 'Tubeless', 'Alloy',
  '10 inch', '165 mm',
  'LED Digital', '{"RedPink"}', '{"Anti-theft Alarm","Find My Scooter","Projector Headlight","USB Charging Port","Keyless Entry","DRL"}', '20 L',
  'Minimalistic urban mobility solution', '{}'
);
*/

-- ============================================================================
-- COLORS FIELD TESTING
-- ============================================================================
-- Test queries to verify colors working:
/*
-- Query: Find all vehicles with Red color
SELECT * FROM vehicles WHERE 'Red' = ANY(colors);

-- Query: Find all vehicles with Blue color
SELECT * FROM vehicles WHERE 'Blue' = ANY(colors);

-- Query: Show all colors for a specific vehicle
SELECT id, model, colors FROM vehicles WHERE id = 1;

-- Query: Add a new color to existing vehicle
UPDATE vehicles SET colors = array_append(colors, 'Green') WHERE id = 1;

-- Query: Remove a color
UPDATE vehicles SET colors = array_remove(colors, 'Green') WHERE id = 1;

-- Query: Show vehicles with multiple colors
SELECT * FROM vehicles WHERE array_length(colors, 1) > 1;
*/

-- ============================================================================
-- MIGRATION STATUS: ✅ COMPLETE
-- ============================================================================
-- The vehicles table is now ready to accept data with:
-- - Comma-separated color input from form
-- - Proper storage as PostgreSQL array
-- - All 35+ technical specification fields
-- - Full backward compatibility with legacy fields
