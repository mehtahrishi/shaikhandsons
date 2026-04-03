# PostgreSQL Migration - Complete API Testing Guide

## ✅ Migration Status: PHASES 1-4 COMPLETE

All authentication, inventory, and file upload systems have been migrated from Appwrite to PostgreSQL.

---

## 🚀 QUICK START

### 1. Start Development Server
```bash
npm run dev
# Runs on http://localhost:9002
```

### 2. Seed Database (Already Done)
```bash
# Admin user automatically created:
# Email: admin@gmail.com
# Password: admin
npm run db:seed-admin
```

---

## 📝 API ENDPOINTS REFERENCE

### **USER AUTHENTICATION**

#### Sign Up
```bash
curl -X POST http://localhost:9002/api/auth/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'

# Response:
# {
#   "success": true,
#   "user": {
#     "id": 1,
#     "email": "user@example.com",
#     "fullName": "John Doe"
#   }
# }
```

#### Request OTP
```bash
curl -X POST http://localhost:9002/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Response:
# {"token": "eyJhbGc..."}
# Copy the token for OTP verification
```

#### Verify OTP
```bash
curl -X POST http://localhost:9002/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGc...",
    "otp": "123456"
  }'

# Response:
# {
#   "success": true,
#   "email": "user@example.com"
# }
```

#### Login (After OTP Verification)
```bash
curl -X POST http://localhost:9002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response:
# {
#   "success": true,
#   "user": {"id": 1, "email": "user@example.com", ...},
#   "token": "eyJhbGc..."
# }
# Cookie set: auth-token (httpOnly)
```

#### Get Current User
```bash
curl -X GET http://localhost:9002/api/auth/me \
  -H "Content-Type: application/json"

# Cookie will be sent automatically
```

#### Logout
```bash
curl -X POST http://localhost:9002/api/auth/logout
```

---

### **ADMIN AUTHENTICATION**

#### Admin Login
```bash
curl -X POST http://localhost:9002/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "admin"
  }'

# Response:
# {
#   "success": true,
#   "user": {"email": "admin@gmail.com", "role": "ADMIN"},
#   "token": "eyJhbGc..."
# }
# Cookie set: admin-token (httpOnly)
```

#### Admin Logout
```bash
curl -X POST http://localhost:9002/api/admin/logout
```

---

### **BRANDS MANAGEMENT** (Requires Admin Auth)

#### Create Brand
```bash
curl -X POST http://localhost:9002/api/admin/brands \
  -H "Content-Type: application/json" \
  -d '{"name": "Tesla"}'

# Response:
# {
#   "success": true,
#   "brand": {
#     "id": 1,
#     "name": "Tesla",
#     "createdAt": "2024-01-01T12:00:00Z"
#   }
# }
```

#### Get All Brands
```bash
curl -X GET http://localhost:9002/api/admin/brands

# Response:
# {
#   "total": 1,
#   "brands": [
#     {"id": 1, "name": "Tesla", "createdAt": "..."}
#   ]
# }
```

#### Update Brand
```bash
curl -X PATCH "http://localhost:9002/api/admin/brands?id=1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Tesla Motors"}'
```

#### Delete Brand
```bash
curl -X DELETE "http://localhost:9002/api/admin/brands?id=1"
```

---

### **VEHICLES MANAGEMENT** (Requires Admin Auth)

#### Create Vehicle
```bash
curl -X POST http://localhost:9002/api/admin/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": 1,
    "make": "Tesla",
    "model": "Model 3",
    "year": 2024,
    "trim": "Long Range",
    "price": 45000,
    "batteryRangeKm": 560,
    "horsepower": 480,
    "zeroToSixtySeconds": 5.8,
    "imageUrls": ["/uploads/image1.jpg"],
    "designPhilosophy": "Performance and efficiency"
  }'

# Response:
# {
#   "success": true,
#   "vehicle": {
#     "id": 1,
#     "brandId": 1,
#     "make": "Tesla",
#     ...
#   }
# }
```

#### Get All Vehicles
```bash
curl -X GET http://localhost:9002/api/admin/inventory

# Response:
# {
#   "total": 1,
#   "vehicles": [...]
# }
```

#### Update Vehicle
```bash
curl -X PATCH "http://localhost:9002/api/admin/inventory?id=1" \
  -H "Content-Type: application/json" \
  -d '{"price": 46000}'
```

#### Delete Vehicle
```bash
curl -X DELETE "http://localhost:9002/api/admin/inventory?id=1"
```

---

### **FILE UPLOADS** (Requires Admin Auth)

#### Upload Image
```bash
curl -X POST http://localhost:9002/api/admin/storage/upload \
  -H "Authorization: Bearer <admin-token>" \
  -F "files=@/path/to/image.jpg"

# Response:
# {
#   "files": [
#     {
#       "id": "a1b2c3d4e5f6...",
#       "name": "image.jpg",
#       "size": 2048576,
#       "type": "image/jpeg",
#       "url": "/uploads/a1b2c3d4e5f6...jpg"
#     }
#   ]
# }
```

#### View/Access Uploaded Image
```bash
# Direct access (no auth required):
http://localhost:9002/api/admin/storage/view/a1b2c3d4e5f6...jpg

# Or via public folder:
http://localhost:9002/uploads/a1b2c3d4e5f6...jpg
```

---

## 📊 DATABASE STRUCTURE

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### OTP Tokens Table
```sql
CREATE TABLE otp_tokens (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### Brands Table
```sql
CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER NOT NULL REFERENCES brands(id),
  make VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  trim VARCHAR(255),
  price DECIMAL(12, 2),
  battery_range_km INTEGER,
  horsepower INTEGER,
  zero_to_sixty_seconds DECIMAL(5, 2),
  design_philosophy TEXT,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 🔐 AUTHENTICATION FLOW

### User Registration & Login
```
1. POST /api/auth/create-user
   → Hash password with bcrypt
   → Store in users table
   → Return user object

2. POST /api/auth/send-otp
   → Generate 6-digit OTP
   → Sign with HMAC-SHA256 JWT (10 min expiry)
   → Send via SMTP email
   → Return signed token

3. POST /api/auth/verify-otp
   → Verify JWT signature
   → Check OTP matches
   → Delete from otp_tokens table

4. POST /api/auth/login
   → Validate email/password
   → Create JWT session token (7 days)
   → Set httpOnly cookie
   → Return user + token
```

### Admin Authentication
```
1. POST /api/admin/auth
   → Query admin_users table
   → Compare password (bcrypt)
   → Create JWT token (7 days)
   → Set httpOnly admin-token cookie

2. All admin operations check cookie via isAdminAuthenticated()
   → Verify JWT signature
   → Confirm role = ADMIN
   → Grant access or return 401
```

---

## 🧪 TESTING CHECKLIST

- [ ] User can sign up with email, password, full name
- [ ] OTP email is sent and received
- [ ] OTP verification works
- [ ] User can login after OTP
- [ ] User auth token is set in httpOnly cookie
- [ ] GET /api/auth/me returns current user
- [ ] Logout clears session
- [ ] Admin can login
- [ ] Admin can create/read/update/delete brands
- [ ] Admin can create/read/update/delete vehicles
- [ ] Admin can upload images
- [ ] Uploaded images accessible via /uploads/
- [ ] Non-admin cannot access admin endpoints (401)
- [ ] Invalid credentials return 401
- [ ] OTP expires after 10 minutes

---

## 📁 NEW FILE LOCATIONS

```
src/
  lib/
    db/
      index.ts                 # Database connection pool
      schema.ts                # Drizzle schema definitions
      auth.ts                  # User auth functions
      admin-auth.ts            # Admin auth functions
      inventory.ts             # Brand/Vehicle CRUD
      migrate.ts               # Migration runner
      seed-admin.ts            # Admin user seeding
      create-missing-tables.ts # Table creation helper
    postgres/
      auth.ts                  # Client-side auth API wrapper
  app/
    api/
      auth/
        create-user/route.ts   # User registration
        send-otp/route.ts      # OTP email sender
        verify-otp/route.ts    # OTP verification
        validate-credentials/route.ts  # Password check
        login/route.ts         # Session creation
        me/route.ts            # Get current user
        logout/route.ts        # Session termination
      admin/
        auth/route.ts          # Admin login
        logout/route.ts        # Admin logout
        brands/route.ts        # Brand CRUD
        inventory/route.ts     # Vehicle CRUD
        storage/
          upload/route.ts      # File upload
          view/[fileId]/route.ts  # File serving
```

---

## 🚨 KNOWN LIMITATIONS & Next Steps

1. **File Storage**: Currently using local filesystem (`/public/uploads`)
   - For production, consider AWS S3, Google Cloud Storage, or Cloudinary
   - Need backup/replication strategy

2. **No Migration Script Yet**: Existing Appwrite data needs manual migration
   - Create export/import service if needed

3. **No Rate Limiting**: Add express-rate-limit to auth endpoints

4. **Environment Variables**: Still contains Appwrite settings
   - Can be removed once verified all functionality works

---

## 🎯 PHASE 5 TASKS (Final Cleanup)

1. Run full end-to-end tests
2. Migrate any existing production data from Appwrite
3. Remove Appwrite SDK and environment variables
4. Add rate limiting to auth endpoints
5. Set up file upload backup/replication
6. Deploy to production
7. Monitor logs for issues
8. Remove Appwrite project

