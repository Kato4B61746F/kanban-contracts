import { z } from 'zod';
import { IsoDateTime, Uuid } from './primitives.js';

export const BoardVisibility = z
  .enum(['private', 'workspace', 'public'])
  .openapi('BoardVisibility');
export type BoardVisibility = z.infer<typeof BoardVisibility>;

export const BoardRole = z.enum(['admin', 'member', 'observer']).openapi('BoardRole');
export type BoardRole = z.infer<typeof BoardRole>;

export const Board = z
  .object({
    id: Uuid,
    workspace_id: Uuid,
    name: z.string().min(1).max(128),
    description: z.string().max(2048).nullable(),
    background: z.string().max(256).nullable(),
    visibility: BoardVisibility,
    archived_at: IsoDateTime.nullable(),
    created_at: IsoDateTime,
    updated_at: IsoDateTime,
  })
  .openapi('Board');

export type Board = z.infer<typeof Board>;

export const BoardMembership = z
  .object({
    board_id: Uuid,
    user_id: Uuid,
    role: BoardRole,
    added_at: IsoDateTime,
  })
  .openapi('BoardMembership');

export type BoardMembership = z.infer<typeof BoardMembership>;

export const CreateBoardInput = z
  .object({
    workspace_id: Uuid,
    name: z.string().min(1).max(128),
    description: z.string().max(2048).nullable().optional(),
    background: z.string().max(256).nullable().optional(),
    visibility: BoardVisibility.default('workspace'),
  })
  .openapi('CreateBoardInput');

export type CreateBoardInput = z.infer<typeof CreateBoardInput>;

export const UpdateBoardInput = z
  .object({
    name: z.string().min(1).max(128).optional(),
    description: z.string().max(2048).nullable().optional(),
    background: z.string().max(256).nullable().optional(),
    visibility: BoardVisibility.optional(),
  })
  .openapi('UpdateBoardInput');

export type UpdateBoardInput = z.infer<typeof UpdateBoardInput>;
