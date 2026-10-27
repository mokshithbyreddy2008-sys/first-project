import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  dietaryPreferences: z.array(z.string()).optional().default([]),
});

export const reservationSchema = z.object({
  reservationDate: z.string().min(1, 'Please select a date'),
  reservationTime: z.string().min(1, 'Please select a time'),
  guestCount: z
    .number({ invalid_type_error: 'Guest count must be a number' })
    .int('Must be a whole number')
    .min(1, 'At least 1 guest required')
    .max(10, 'Maximum 10 guests'),
  seatingPreference: z.enum(['indoor', 'outdoor', 'booth', 'bar'], {
    errorMap: () => ({ message: 'Please select a seating preference' }),
  }),
  specialRequests: z.string().max(300, 'Max 300 characters').optional().default(''),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[\d\s\-+()]*$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  dietaryPreferences: z.array(z.string()).optional().default([]),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
