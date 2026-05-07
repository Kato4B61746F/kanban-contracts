import { z } from 'zod';
import { HexColor, Uuid } from './primitives.js';

export const Label = z
  .object({
    id: Uuid,
    board_id: Uuid,
    name: z.string().min(1).max(64),
    color: HexColor,
  })
  .openapi('Label');

export type Label = z.infer<typeof Label>;

export const CardLabel = z
  .object({
    card_id: Uuid,
    label_id: Uuid,
  })
  .openapi('CardLabel');

export type CardLabel = z.infer<typeof CardLabel>;

export const CreateLabelInput = z
  .object({
    board_id: Uuid,
    name: z.string().min(1).max(64),
    color: HexColor,
  })
  .openapi('CreateLabelInput');

export type CreateLabelInput = z.infer<typeof CreateLabelInput>;

export const UpdateLabelInput = z
  .object({
    name: z.string().min(1).max(64).optional(),
    color: HexColor.optional(),
  })
  .openapi('UpdateLabelInput');

export type UpdateLabelInput = z.infer<typeof UpdateLabelInput>;
