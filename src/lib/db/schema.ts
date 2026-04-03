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

// OTP tokens table
export const otpTokens = pgTable(
  'otp_tokens',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    emailIdx: index('idx_otp_tokens_email').on(table.email),
    expiresIdx: index('idx_otp_tokens_expires').on(table.expiresAt),
  })
);

// Brands table
export const brands = pgTable(
  'brands',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
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

// Sessions table (for JWT refresh tokens)
export const sessions = pgTable(
  'sessions',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    userIdx: index('idx_sessions_user').on(table.userId),
    expiresIdx: index('idx_sessions_expires').on(table.expiresAt),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
