import { z } from 'zod';
import { FractionalPosition, IsoDateTime, Uuid } from './primitives.js';

export const List = z
  .object({
    id: Uuid,
    board_id: Uuid,
    name: z.string().min(1).max(128),
    position: FractionalPosition,
    archived_at: IsoDateTime.nullable(),
    created_at: IsoDateTime,
    updated_at: IsoDateTime,
  })
  .openapi('List');

export type List = z.infer<typeof List>;

export const CreateListInput = z
  .object({
    board_id: Uuid,
    name: z.string().min(1).max(128),
    after_list_id: Uuid.nullable().optional().openapi({
      description:
        'If provided, the new list is placed after this list. If null/omitted, placed at the end.',
    }),
  })
  .openapi('CreateListInput');

export type CreateListInput = z.infer<typeof CreateListInput>;

export const UpdateListInput = z
  .object({
    name: z.string().min(1).max(128).optional(),
  })
  .openapi('UpdateListInput');

export type UpdateListInput = z.infer<typeof UpdateListInput>;

export const MoveListInput = z
  .object({
    after_list_id: Uuid.nullable().openapi({
      description: 'Place this list after this list id. null moves to the start.',
    }),
  })
  .openapi('MoveListInput');

export type MoveListInput = z.infer<typeof MoveListInput>;
