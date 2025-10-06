/**
 * Auth Validation Schemas using Zod
 */
import { z } from 'zod';

/**
 * Password validation rules:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 number
 */
const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
  .regex(/[0-9]/, 'La contraseña debe contener al menos un número');

/**
 * Username validation rules:
 * - Minimum 3 characters
 * - Maximum 30 characters
 * - Only alphanumeric and underscores
 * - Must start with a letter
 */
const usernameSchema = z
  .string()
  .min(3, 'El username debe tener al menos 3 caracteres')
  .max(30, 'El username no puede exceder 30 caracteres')
  .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'El username debe comenzar con una letra y solo contener letras, números y guiones bajos');

/**
 * Register Form Validation Schema
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .email('Email inválido')
      .min(1, 'El email es requerido'),

    username: usernameSchema,

    password: passwordSchema,

    confirmPassword: z
      .string()
      .min(1, 'Confirma tu contraseña'),

    full_name: z
      .string()
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Login Form Validation Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'El email es requerido'),

  password: z
    .string()
    .min(1, 'La contraseña es requerida'),

  remember: z
    .boolean()
    .default(false),
});

/**
 * Type inference from schemas
 */
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
