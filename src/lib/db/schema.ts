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
    price: decimal('price', { precision: 12, scale: 2 }),
    batteryRangeKm: integer('battery_range_km'),
    horsepower: integer('horsepower'),
    zeroToSixtySeconds: decimal('zero_to_sixty_seconds', { precision: 5, scale: 2 }),
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

// Admin users table
export const adminUsers = pgTable(
  'admin_users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  }
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
