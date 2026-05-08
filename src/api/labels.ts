import { z } from 'zod';
import { CreateLabelInput, Label, UpdateLabelInput } from '../schemas/label.js';
import { Uuid } from '../schemas/primitives.js';
import { bearerAuth, errorResponses, jsonContent } from './_helpers.js';
import { registry } from './registry.js';

export function registerLabelPaths(): void {
  registry.registerPath({
    method: 'get',
    path: '/boards/{board_id}/labels',
    tags: ['labels'],
    summary: 'List labels defined on a board',
    security: bearerAuth,
    request: { params: z.object({ board_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(z.array(Label)) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/labels',
    tags: ['labels'],
    summary: 'Create a label on a board',
    security: bearerAuth,
    request: { body: { content: jsonContent(CreateLabelInput) } },
    responses: {
      201: { description: 'Created', content: jsonContent(Label) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/labels/{label_id}',
    tags: ['labels'],
    summary: 'Update a label',
    security: bearerAuth,
    request: {
      params: z.object({ label_id: Uuid }),
      body: { content: jsonContent(UpdateLabelInput) },
    },
    responses: {
      200: { description: 'OK', content: jsonContent(Label) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/labels/{label_id}',
    tags: ['labels'],
    summary: 'Delete a label',
    security: bearerAuth,
    request: { params: z.object({ label_id: Uuid }) },
    responses: {
      204: { description: 'No Content' },
      ...errorResponses,
    },
  });
}
