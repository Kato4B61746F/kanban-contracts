import { z } from 'zod';
import { Email, IsoDateTime } from './primitives.js';
import { User } from './user.js';

export const LoginInput = z
  .object({
    email: Email,
    password: z.string().min(8).max(128),
  })
  .openapi('LoginInput');

export type LoginInput = z.infer<typeof LoginInput>;

export const SignupInput = z
  .object({
    email: Email,
    password: z.string().min(8).max(128),
    display_name: z.string().min(1).max(64),
  })
  .openapi('SignupInput');

export type SignupInput = z.infer<typeof SignupInput>;

export const TokenPair = z
  .object({
    access_token: z.string().openapi({ description: 'JWT access token (RS256)' }),
    refresh_token: z.string().openapi({ description: 'Long-lived refresh token (opaque)' }),
    expires_at: IsoDateTime,
  })
  .openapi('TokenPair');

export type TokenPair = z.infer<typeof TokenPair>;

export const AuthResponse = z
  .object({
    user: User,
    tokens: TokenPair,
  })
  .openapi('AuthResponse');

export type AuthResponse = z.infer<typeof AuthResponse>;

export const RefreshInput = z
  .object({
    refresh_token: z.string(),
  })
  .openapi('RefreshInput');

export type RefreshInput = z.infer<typeof RefreshInput>;
