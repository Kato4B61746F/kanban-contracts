import { z } from 'zod';
import { Comment, CreateCommentInput, UpdateCommentInput } from '../schemas/comment.js';
import { Uuid } from '../schemas/primitives.js';
import { bearerAuth, errorResponses, jsonContent } from './_helpers.js';
import { registry } from './registry.js';

export function registerCommentPaths(): void {
  registry.registerPath({
    method: 'get',
    path: '/cards/{card_id}/comments',
    tags: ['comments'],
    summary: 'List comments on a card',
    security: bearerAuth,
    request: { params: z.object({ card_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(z.array(Comment)) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/cards/{card_id}/comments',
    tags: ['comments'],
    summary: 'Post a comment on a card',
    security: bearerAuth,
    request: {
      params: z.object({ card_id: Uuid }),
      body: { content: jsonContent(CreateCommentInput) },
    },
    responses: {
      201: { description: 'Created', content: jsonContent(Comment) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/comments/{comment_id}',
    tags: ['comments'],
    summary: 'Update a comment (author only)',
    security: bearerAuth,
    request: {
      params: z.object({ comment_id: Uuid }),
      body: { content: jsonContent(UpdateCommentInput) },
    },
    responses: {
      200: { description: 'OK', content: jsonContent(Comment) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/comments/{comment_id}',
    tags: ['comments'],
    summary: 'Soft-delete a comment (author or board admin)',
    security: bearerAuth,
    request: { params: z.object({ comment_id: Uuid }) },
    responses: {
      204: { description: 'No Content' },
      ...errorResponses,
    },
  });
}
