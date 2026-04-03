# 🔄 PostgreSQL Migration Guide - Vehicles Table

## 📋 What Changed

- ✅ Colors field reverted to **text input (comma-separated)**
- ✅ Migration script created to drop and recreate table
- ✅ All 35+ technical fields preserved
- ✅ Database indexes added for performance

---

## 🚀 How to Run the Migration

### Step 1: Connect to PostgreSQL
```bash
psql -U shaikh -d shaikhandsons_db -h localhost
```

### Step 2: Run the Migration Script
```sql
\i sql/migration-drop-recreate-vehicles.sql
```

Or copy-paste the entire script from `sql/migration-drop-recreate-vehicles.sql` into psql.

---

## 📝 Colors Field Usage

### Input Format (Frontend - Form)
```
User Types: "Red, Blue, Grey"
         ↓
Form Processing: split(',').map(c => c.trim()).filter(Boolean)
         ↓
Result Array: ["Red", "Blue", "Grey"]
         ↓
Sent to API: {"colors": ["Red", "Blue", "Grey"]}
```

### Storage Format (PostgreSQL Database)
```sql
-- Data stored as PostgreSQL array:
colors = '{"Red", "Blue", "Grey"}'

-- Can be queried using:
WHERE 'Red' = ANY(colors)
```

### Output Format (Display)
```javascript
// Stored as array in database
colors: ["Red", "Blue", "Grey"]

// Displayed in form as:
"Red, Blue, Grey"
```

---

## 🔍 Common PostgreSQL Queries for Colors

### Find vehicles with a specific color
```sql
SELECT * FROM vehicles WHERE 'Red' = ANY(colors);
```

### Find vehicles with Red OR Blue
```sql
SELECT * FROM vehicles 
WHERE 'Red' = ANY(colors) OR 'Blue' = ANY(colors);
```

### Show colors for a specific vehicle
```sql
SELECT id, model, colors FROM vehicles WHERE id = 1;
```

### Add a new color to existing vehicle
```sql
UPDATE vehicles SET colors = array_append(colors, 'Green') WHERE id = 1;
```

### Remove a color from vehicle
```sql
UPDATE vehicles SET colors = array_remove(colors, 'Green') WHERE id = 1;
```

### Count vehicles with each color
```sql
SELECT DISTINCT color, COUNT(*) 
FROM vehicles, unnest(colors) AS color 
GROUP BY color;
```

---

## 🎯 Step-by-Step Migration Process

### For Fresh Database (Recommended)
1. **Connect to PostgreSQL**
   ```bash
   psql -U shaikh -d shaikhandsons_db -h localhost
   ```

2. **Run migration script**
   ```sql
   \i sql/migration-drop-recreate-vehicles.sql
   ```

3. **Verify table created**
   ```sql
   \dt vehicles
   ```

4. **Test with sample data (optional)**
   ```sql
   -- Uncomment the INSERT test section in migration script
   INSERT INTO vehicles (...) VALUES (...);
   ```

### For Existing Data (Backup First!)
1. **Backup your data**
   ```bash
   pg_dump -U shaikh shaikhandsons_db > backup-$(date +%Y%m%d-%H%M%S).sql
   ```

2. **Export vehicles data**
   ```sql
   SELECT * INTO vehicles_backup FROM vehicles;
   ```

3. **Run migration**
   ```sql
   \i sql/migration-drop-recreate-vehicles.sql
   ```

4. **Restore data if needed**
   ```sql
   -- If migration went wrong, restore from backup
   \i backup-YYYYMMDD-HHMMSS.sql
   ```

---

## ✅ Verification Checklist

After running migration, verify:

- [ ] Table `vehicles` exists
```sql
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicles');
```

- [ ] All columns exist
```sql
\d vehicles
```

- [ ] Foreign key to brands exists
```sql
\d vehicles
```

- [ ] Indexes created
```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'vehicles';
```

- [ ] Can insert test data
```sql
INSERT INTO vehicles (brand_id, make, model, price) VALUES (1, 'Test', 'Model', 50000);
```

- [ ] Colors array works
```sql
UPDATE vehicles SET colors = '{"Red", "Blue"}' WHERE id = 1;
SELECT colors FROM vehicles WHERE id = 1;
```

---

## 📊 Table Structure Summary

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | SERIAL | ✅ PRIMARY KEY | Auto-increment |
| brand_id | INTEGER | ❌ NOT NULL | FK → brands |
| make | VARCHAR(255) | ❌ NOT NULL | Manufacturer |
| model | VARCHAR(255) | ❌ NOT NULL | Model name |
| price | DECIMAL(12,2) | ❌ NOT NULL | In rupees |
| colors | TEXT[] | ✅ | Array: '{"Red","Blue"}' |
| key_features | TEXT[] | ✅ | Array format |
| riding_modes | TEXT[] | ✅ | Array format |
| created_at | TIMESTAMP | ✅ | Auto-set |
| updated_at | TIMESTAMP | ✅ | Auto-set |
| ... | ... | ... | 25+ more columns |

---

## 🎨 Colors Storage Examples

### Valid Inputs
```sql
-- Empty/NULL
colors = NULL
colors = '{}'

-- Single color
colors = '{"Red"}'

-- Multiple colors
colors = '{"Red", "Blue", "Grey"}'

-- Different format (also valid)
colors = ARRAY['Red', 'Blue', 'Grey']
```

### What the Form Sends
- User input: `"Red, Blue, Grey"`
- API receives: `["Red", "Blue", "Grey"]`
- Stored as: `'{"Red", "Blue", "Grey"}'`
- Retrieved as: `["Red", "Blue", "Grey"]`

---

## 🔧 Rollback Instructions

If something goes wrong:

```sql
-- Check backup file
\l

-- List all backups
ls -la backup-*.sql

-- Restore from backup
psql -U shaikh shaikhandsons_db < backup-20260403-120000.sql

-- Or within psql:
\i backup-20260403-120000.sql
```

---

## 📝 Frontend Implementation

The form already handles colors correctly:

```typescript
// Text input accepts comma-separated values
<Input 
  value={formData.colors.join(', ')}
  onChange={(e) => setFormData(prev => ({
    ...prev, 
    colors: e.target.value
      .split(',')
      .map(c => c.trim())
      .filter(Boolean)
  }))}
  placeholder="Red, Blue, Grey" 
/>
```

This automatically:
- ✅ Takes user input: "Red, Blue, Grey"
- ✅ Splits by comma
- ✅ Trims whitespace
- ✅ Filters empty values
- ✅ Stores as array: ["Red", "Blue", "Grey"]
- ✅ Sends to API correctly

---

## 🎯 Summary

| Task | Status | Command |
|------|--------|---------|
| Drop old vehicles table | ✅ | Script included |
| Create new vehicles table | ✅ | Script included |
| Add all 35+ columns | ✅ | All present |
| Setup colors as TEXT[] | ✅ | Ready for input |
| Create indexes | ✅ | 5 indexes added |
| Test with sample data | 📝 | Included in script (commented) |

**Ready to migrate! Run the SQL script and your form will work perfectly.** 🚀
