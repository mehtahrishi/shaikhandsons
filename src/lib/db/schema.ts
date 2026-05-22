import { pgTable, serial, varchar, timestamp, boolean, integer, decimal, text, uniqueIndex, index, foreignKey } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    fullName: varchar('full_name', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    address: varchar('address', { length: 500 }),
    isVerified: boolean('is_verified').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
  })
);

// Brands table
export const brands = pgTable(
  'brands',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    imageUrl: varchar('image_url', { length: 500 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  }
);

// Vehicles table
export const vehicles = pgTable(
  'vehicles',
  {
    id: serial('id').primaryKey(),
    brandId: integer('brand_id').notNull(),
    make: varchar('make', { length: 255 }).notNull(),
    model: varchar('model', { length: 255 }).notNull(),
    year: integer('year').notNull(),
    trim: varchar('trim', { length: 255 }),
    price: decimal('price', { precision: 12, scale: 2 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique(),

    // Basic Info
    modelCode: varchar('model_code', { length: 100 }),
    category: varchar('category', { length: 50 }), // Scooter, Bike, Loader
    shortDescription: text('short_description'),

    // Performance
    topSpeed: varchar('top_speed', { length: 50 }),
    certifiedRange: varchar('certified_range', { length: 50 }),
    realWorldRange: varchar('real_world_range', { length: 100 }),
    ridingModes: text('riding_modes').array().default([]),
    climbingDegree: varchar('climbing_degree', { length: 50 }),
    loadCapacity: varchar('load_capacity', { length: 50 }),

    // Battery & Charging
    batteryType: varchar('battery_type', { length: 100 }),
    batteryCapacity: varchar('battery_capacity', { length: 100 }),
    chargingTime: varchar('charging_time', { length: 100 }),
    fastCharging: boolean('fast_charging').default(false),
    chargerIncluded: varchar('charger_included', { length: 255 }),
    batteryWarranty: varchar('battery_warranty', { length: 100 }),

    // Hardware
    motorPower: varchar('motor_power', { length: 100 }),
    brakingSystem: varchar('braking_system', { length: 100 }),
    tyreType: varchar('tyre_type', { length: 50 }),
    wheelType: varchar('wheel_type', { length: 50 }),
    wheelSize: varchar('wheel_size', { length: 50 }),
    groundClearance: varchar('ground_clearance', { length: 50 }),

    // Smart Features & Aesthetics
    displayType: varchar('display_type', { length: 100 }),
    colors: text('colors').array().default([]),
    keyFeatures: text('key_features').array().default([]),
    bootSpace: varchar('boot_space', { length: 50 }),

    // Original fields kept for compatibility
    batteryRangeKm: integer('battery_range_km'), // Legacy
    horsepower: integer('horsepower'), // Legacy
    zeroToSixtySeconds: decimal('zero_to_sixty_seconds', { precision: 5, scale: 2 }), // Legacy
    designPhilosophy: text('design_philosophy'),
    imageUrls: text('image_urls').array().default([]),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    brandFk: foreignKey({
      columns: [table.brandId],
      foreignColumns: [brands.id],
    }).onDelete('cascade'),
    brandIdx: index('idx_vehicles_brand').on(table.brandId),
    yearIdx: index('idx_vehicles_year').on(table.year),
    categoryIdx: index('idx_vehicles_category').on(table.category),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// Global Variants
// Battery/engine/trim variants that can be defined once and reused/mapped.
// ─────────────────────────────────────────────────────────────────────────────
export const globalVariants = pgTable(
  'global_variants',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    variantType: varchar('variant_type', { length: 50 }).notNull().default('battery'), // "battery" | "engine" | "trim"
    price: decimal('price', { precision: 12, scale: 2 }).notNull().default('0.00'),
    chargingTime: varchar('charging_time', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    nameIdx: uniqueIndex('idx_global_variants_name').on(table.name),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// Vehicle Variants Mappings
// Maps global variants to specific vehicles, with customized prices.
// vehicles.price stays as the "Starting from" base.
// ─────────────────────────────────────────────────────────────────────────────
export const vehicleVariants = pgTable(
  'vehicle_variants',
  {
    id: serial('id').primaryKey(),
    vehicleId: integer('vehicle_id').notNull(),
    globalVariantId: integer('global_variant_id').notNull(),
    isDefault: boolean('is_default').default(false),   // Pre-selected on detail page
    isAvailable: boolean('is_available').default(true), // Hide sold-out variants
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    vehicleFk: foreignKey({
      columns: [table.vehicleId],
      foreignColumns: [vehicles.id],
    }).onDelete('cascade'),
    globalVariantFk: foreignKey({
      columns: [table.globalVariantId],
      foreignColumns: [globalVariants.id],
    }).onDelete('cascade'),
    vehicleIdx: index('idx_variants_vehicle').on(table.vehicleId),
    globalVariantIdx: index('idx_variants_global_variant').on(table.globalVariantId),
    availableIdx: index('idx_variants_available').on(table.isAvailable),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// Coupons
// Discount codes used at booking/checkout.
// discountType: "percentage" (0-100) | "flat" (₹ amount off)
// ─────────────────────────────────────────────────────────────────────────────
export const coupons = pgTable(
  'coupons',
  {
    id: serial('id').primaryKey(),

    // Code customers enter  e.g. "LAUNCH20", "MONSOON500"
    code: varchar('code', { length: 50 }).notNull().unique(),

    description: text('description'),

    // "percentage" | "flat"
    discountType: varchar('discount_type', { length: 20 }).notNull().default('percentage'),
    discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),

    // Max ₹ cap for percentage coupons  e.g. max ₹2000 off even if 20% > ₹2000
    maxDiscountAmount: decimal('max_discount_amount', { precision: 10, scale: 2 }),

    // Minimum cart/order value needed to apply
    minOrderValue: decimal('min_order_value', { precision: 12, scale: 2 }),

    usageLimit: integer('usage_limit'),       // null = unlimited
    usedCount: integer('used_count').default(0),
    perUserLimit: integer('per_user_limit').default(1), // 1 = one-time per user

    validFrom: timestamp('valid_from').defaultNow(),
    validUntil: timestamp('valid_until'),

    isActive: boolean('is_active').default(true),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    codeIdx: uniqueIndex('idx_coupons_code').on(table.code),
    activeIdx: index('idx_coupons_active').on(table.isActive),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// Orders
// Customer bookings / reservations. Supports guest (userId nullable).
// orderType: "test_drive" | "purchase"
// status:    "pending" | "confirmed" | "cancelled" | "completed"
// ─────────────────────────────────────────────────────────────────────────────
export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),

    // Nullable → guest bookings allowed; populated if user is logged in
    userId: integer('user_id'),

    // Vehicle reference
    vehicleId: integer('vehicle_id').notNull(),
    vehicleSlug: varchar('vehicle_slug', { length: 255 }).notNull(),
    vehicleName: varchar('vehicle_name', { length: 255 }).notNull(), // name snapshot

    // Variant chosen by customer (null if vehicle has no variants)
    variantId: integer('variant_id'),
    variantName: varchar('variant_name', { length: 255 }), // snapshot

    // Price snapshot at time of order
    vehiclePrice: decimal('vehicle_price', { precision: 12, scale: 2 }),

    // Coupon applied (if any)
    couponId: integer('coupon_id'),
    couponCode: varchar('coupon_code', { length: 50 }),   // snapshot
    discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
    finalPrice: decimal('final_price', { precision: 12, scale: 2 }),

    // Customer contact details
    customerName: varchar('customer_name', { length: 255 }).notNull(),
    customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
    customerEmail: varchar('customer_email', { length: 255 }),

    // Booking preference
    preferredShowroom: varchar('preferred_showroom', { length: 255 }),
    preferredDate: varchar('preferred_date', { length: 50 }),

    orderType: varchar('order_type', { length: 50 }).default('test_drive'),
    status: varchar('status', { length: 50 }).default('pending'),
    adminNotes: text('admin_notes'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }).onDelete('set null'),
    vehicleFk: foreignKey({
      columns: [table.vehicleId],
      foreignColumns: [vehicles.id],
    }).onDelete('cascade'),
    variantFk: foreignKey({
      columns: [table.variantId],
      foreignColumns: [vehicleVariants.id],
    }).onDelete('set null'),
    couponFk: foreignKey({
      columns: [table.couponId],
      foreignColumns: [coupons.id],
    }).onDelete('set null'),
    statusIdx: index('idx_orders_status').on(table.status),
    createdAtIdx: index('idx_orders_created_at').on(table.createdAt),
    vehicleIdx: index('idx_orders_vehicle').on(table.vehicleId),
  })
);

// Likes table
export const likes = pgTable(
  'likes',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    vehicleId: integer('vehicle_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }).onDelete('cascade'),
    vehicleFk: foreignKey({
      columns: [table.vehicleId],
      foreignColumns: [vehicles.id],
    }).onDelete('cascade'),
    userVehicleUnique: uniqueIndex('idx_likes_user_vehicle').on(table.userId, table.vehicleId),
    vehicleIdx: index('idx_likes_vehicle').on(table.vehicleId),
  })
);

// ─── Type Exports ─────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
export type VehicleVariant = typeof vehicleVariants.$inferSelect;
export type NewVehicleVariant = typeof vehicleVariants.$inferInsert;
export type GlobalVariant = typeof globalVariants.$inferSelect;
export type NewGlobalVariant = typeof globalVariants.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
