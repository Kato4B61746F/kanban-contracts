import { z } from 'zod';
import { IsoDateTime, Uuid } from './primitives.js';

export const Comment = z
  .object({
    id: Uuid,
    card_id: Uuid,
    author_id: Uuid,
    body: z.string().min(1).max(16_384),
    created_at: IsoDateTime,
    updated_at: IsoDateTime,
    deleted_at: IsoDateTime.nullable(),
  })
  .openapi('Comment');

export type Comment = z.infer<typeof Comment>;

export const CreateCommentInput = z
  .object({
    body: z.string().min(1).max(16_384),
  })
  .openapi('CreateCommentInput');

export type CreateCommentInput = z.infer<typeof CreateCommentInput>;

export const UpdateCommentInput = z
  .object({
    body: z.string().min(1).max(16_384),
  })
  .openapi('UpdateCommentInput');

export type UpdateCommentInput = z.infer<typeof UpdateCommentInput>;
