import { z } from 'zod';
import { Activity, ActivityType } from '../schemas/activity.js';
import { PaginationQuery, Uuid } from '../schemas/primitives.js';
import { bearerAuth, errorResponses, jsonContent } from './_helpers.js';
import { registry } from './registry.js';

export function registerActivityPaths(): void {
  registry.registerPath({
    method: 'get',
    path: '/boards/{board_id}/activities',
    tags: ['activities'],
    summary: 'List activities on a board (newest first)',
    security: bearerAuth,
    request: {
      params: z.object({ board_id: Uuid }),
      query: PaginationQuery.extend({
        type: ActivityType.optional(),
      }),
    },
    responses: {
      200: { description: 'OK', content: jsonContent(z.array(Activity)) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/cards/{card_id}/activities',
    tags: ['activities'],
    summary: 'List activities on a single card',
    security: bearerAuth,
    request: {
      params: z.object({ card_id: Uuid }),
      query: PaginationQuery,
    },
    responses: {
      200: { description: 'OK', content: jsonContent(z.array(Activity)) },
      ...errorResponses,
    },
  });
}
