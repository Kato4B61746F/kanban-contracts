import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const Uuid = z.string().uuid().openapi({
  description: 'UUID (any version, typically v4)',
  example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
});

export const IsoDateTime = z.string().datetime({ offset: true }).openapi({
  description: 'ISO 8601 datetime with timezone offset',
  example: '2026-05-08T12:34:56.000Z',
});

export const HexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/)
  .openapi({
    description: 'Hex color code',
    example: '#FF5733',
  });

export const FractionalPosition = z.string().min(1).openapi({
  description:
    'Fractional indexing position string. Allows insertion between any two positions without renumbering.',
  example: 'a1',
});

export const Slug = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .openapi({
    description: 'kebab-case identifier',
    example: 'my-team',
  });

export const Email = z.string().email().openapi({
  description: 'RFC 5322 email address',
  example: 'user@example.com',
});

export const PaginationQuery = z.object({
  cursor: z.string().optional().openapi({ description: 'Opaque pagination cursor' }),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const ErrorResponse = z
  .object({
    code: z.string().openapi({ example: 'NOT_FOUND' }),
    message: z.string().openapi({ example: 'Resource not found' }),
    details: z.record(z.unknown()).optional(),
  })
  .openapi('ErrorResponse');

export type ErrorResponse = z.infer<typeof ErrorResponse>;
