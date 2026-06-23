import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive().optional().nullable(),
  cost: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  weight: z.number().positive().optional().nullable(),
});

export const addressSchema = z.object({
  label: z.string().min(1),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(10),
  address1: z.string().min(5),
  address2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  isDefault: z.boolean().default(false),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

export const couponSchema = z.object({
  code: z.string().min(3).max(20).regex(/^[A-Z0-9]+$/),
  type: z.enum(['percentage', 'fixed', 'free_shipping']),
  value: z.number().positive(),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().default(1),
  startDate: z.date(),
  endDate: z.date(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: emailSchema,
  subject: z.string().min(3),
  message: z.string().min(10).max(2000),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type ContactInput = z.infer<typeof contactSchema>;