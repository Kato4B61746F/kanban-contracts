import { z } from 'zod';
import { CreateListInput, List, MoveListInput, UpdateListInput } from '../schemas/list.js';
import { Uuid } from '../schemas/primitives.js';
import { bearerAuth, errorResponses, jsonContent } from './_helpers.js';
import { registry } from './registry.js';

export function registerListPaths(): void {
  registry.registerPath({
    method: 'get',
    path: '/boards/{board_id}/lists',
    tags: ['lists'],
    summary: 'List lists on a board (in position order)',
    security: bearerAuth,
    request: { params: z.object({ board_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(z.array(List)) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/lists',
    tags: ['lists'],
    summary: 'Create a list',
    security: bearerAuth,
    request: { body: { content: jsonContent(CreateListInput) } },
    responses: {
      201: { description: 'Created', content: jsonContent(List) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/lists/{list_id}',
    tags: ['lists'],
    summary: 'Update a list',
    security: bearerAuth,
    request: {
      params: z.object({ list_id: Uuid }),
      body: { content: jsonContent(UpdateListInput) },
    },
    responses: {
      200: { description: 'OK', content: jsonContent(List) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/lists/{list_id}/move',
    tags: ['lists'],
    summary: 'Move a list within its board',
    security: bearerAuth,
    request: {
      params: z.object({ list_id: Uuid }),
      body: { content: jsonContent(MoveListInput) },
    },
    responses: {
      200: { description: 'OK', content: jsonContent(List) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/lists/{list_id}/archive',
    tags: ['lists'],
    summary: 'Archive a list',
    security: bearerAuth,
    request: { params: z.object({ list_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(List) },
      ...errorResponses,
    },
  });
}
