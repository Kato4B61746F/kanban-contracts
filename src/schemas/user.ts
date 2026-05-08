import { z } from 'zod';
import { Email, IsoDateTime, Uuid } from './primitives.js';

export const User = z
  .object({
    id: Uuid,
    email: Email,
    display_name: z.string().min(1).max(64),
    avatar_url: z.string().url().nullable(),
    created_at: IsoDateTime,
    updated_at: IsoDateTime,
  })
  .openapi('User');

export type User = z.infer<typeof User>;

export const UpdateUserInput = z
  .object({
    display_name: z.string().min(1).max(64).optional(),
    avatar_url: z.string().url().nullable().optional(),
  })
  .openapi('UpdateUserInput');

export type UpdateUserInput = z.infer<typeof UpdateUserInput>;
