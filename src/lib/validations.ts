import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const adminLoginSchema = z.object({
  email: z.string().email('Invalid admin email'),
  password: z.string().min(1, 'Admin password is required'),
});

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
});

export const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8),
  token: z.string(),
});

// ─── Vehicle Variants ─────────────────────────────────────────────────────────

export const createVariantSchema = z.object({
  vehicleId: z.number().int().positive(),
  name: z.string().min(1, 'Variant name is required'),
  variantType: z.enum(['battery', 'engine', 'trim', 'ev', 'petrol', 'gas']).default('ev'),
  price: z.number().positive('Price must be positive'),
  chargingTime: z.string().optional().nullable(),
  isDefault: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
  globalVariantId: z.number().int().positive().optional(),
});

export const updateVariantSchema = createVariantSchema.partial().extend({
  id: z.number().int().positive(),
});

// ─── Coupons ─────────────────────────────────────────────────────────────────

export const createCouponSchema = z.object({
  code: z.string().min(2).max(50).toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.number().positive(),
  maxDiscountAmount: z.number().positive().optional().nullable(),
  minOrderValue: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  perUserLimit: z.number().int().positive().optional().default(1),
  validFrom: z.string().optional(),   // ISO date string
  validUntil: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const updateCouponSchema = createCouponSchema.partial().extend({
  id: z.number().int().positive(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1),
  orderValue: z.number().positive(),
});

// ─── Orders ───────────────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
  vehicleSlug: z.string().min(1),
  variantId: z.number().int().positive().optional().nullable(),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().min(7, 'Please enter a valid phone number'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  preferredShowroom: z.string().optional(),
  preferredDate: z.string().optional(),
  orderType: z.enum(['test_drive', 'purchase']).default('test_drive'),
  couponCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  adminNotes: z.string().optional(),
});
