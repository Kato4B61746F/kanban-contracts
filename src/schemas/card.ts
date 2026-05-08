import { z } from 'zod';
import { FractionalPosition, IsoDateTime, Uuid } from './primitives.js';

export const Card = z
  .object({
    id: Uuid,
    list_id: Uuid,
    title: z.string().min(1).max(256),
    description: z.string().max(16_384).nullable(),
    position: FractionalPosition,
    due_date: IsoDateTime.nullable(),
    completed_at: IsoDateTime.nullable(),
    archived_at: IsoDateTime.nullable(),
    created_by: Uuid,
    created_at: IsoDateTime,
    updated_at: IsoDateTime,
  })
  .openapi('Card');

export type Card = z.infer<typeof Card>;

export const CardAssignee = z
  .object({
    card_id: Uuid,
    user_id: Uuid,
    assigned_at: IsoDateTime,
    assigned_by: Uuid,
  })
  .openapi('CardAssignee');

export type CardAssignee = z.infer<typeof CardAssignee>;

export const CreateCardInput = z
  .object({
    list_id: Uuid,
    title: z.string().min(1).max(256),
    description: z.string().max(16_384).nullable().optional(),
    after_card_id: Uuid.nullable().optional().openapi({
      description: 'If provided, place after this card. If null/omitted, append to end of list.',
    }),
    due_date: IsoDateTime.nullable().optional(),
  })
  .openapi('CreateCardInput');

export type CreateCardInput = z.infer<typeof CreateCardInput>;

export const UpdateCardInput = z
  .object({
    title: z.string().min(1).max(256).optional(),
    description: z.string().max(16_384).nullable().optional(),
    due_date: IsoDateTime.nullable().optional(),
    completed_at: IsoDateTime.nullable().optional(),
  })
  .openapi('UpdateCardInput');

export type UpdateCardInput = z.infer<typeof UpdateCardInput>;

export const MoveCardInput = z
  .object({
    target_list_id: Uuid,
    after_card_id: Uuid.nullable().openapi({
      description: 'Place after this card id within the target list. null moves to the start.',
    }),
  })
  .openapi('MoveCardInput');

export type MoveCardInput = z.infer<typeof MoveCardInput>;
