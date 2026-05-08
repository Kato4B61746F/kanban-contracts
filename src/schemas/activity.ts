import { z } from 'zod';
import { IsoDateTime, Uuid } from './primitives.js';

export const ActivityType = z
  .enum([
    'card.created',
    'card.moved',
    'card.archived',
    'card.completed',
    'card.assigned',
    'card.unassigned',
    'card.labeled',
    'card.unlabeled',
    'card.commented',
    'card.described',
    'list.created',
    'list.archived',
    'list.renamed',
    'board.created',
    'board.member_added',
    'board.member_removed',
    'board.archived',
    'workspace.member_added',
    'workspace.member_removed',
  ])
  .openapi('ActivityType');

export type ActivityType = z.infer<typeof ActivityType>;

export const Activity = z
  .object({
    id: Uuid,
    workspace_id: Uuid,
    board_id: Uuid.nullable(),
    card_id: Uuid.nullable(),
    actor_id: Uuid,
    type: ActivityType,
    payload: z.record(z.unknown()).openapi({
      description: 'Type-specific payload. Schema depends on Activity.type.',
    }),
    created_at: IsoDateTime,
  })
  .openapi('Activity');

export type Activity = z.infer<typeof Activity>;
