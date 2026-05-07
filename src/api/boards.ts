import { z } from 'zod';
import { Board, BoardMembership, CreateBoardInput, UpdateBoardInput } from '../schemas/board.js';
import { Uuid } from '../schemas/primitives.js';
import { bearerAuth, errorResponses, jsonContent } from './_helpers.js';
import { registry } from './registry.js';

export function registerBoardPaths(): void {
  registry.registerPath({
    method: 'get',
    path: '/workspaces/{workspace_id}/boards',
    tags: ['boards'],
    summary: 'List boards in a workspace visible to the current user',
    security: bearerAuth,
    request: { params: z.object({ workspace_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(z.array(Board)) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/boards',
    tags: ['boards'],
    summary: 'Create a board',
    security: bearerAuth,
    request: { body: { content: jsonContent(CreateBoardInput) } },
    responses: {
      201: { description: 'Created', content: jsonContent(Board) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/boards/{board_id}',
    tags: ['boards'],
    summary: 'Get a board',
    security: bearerAuth,
    request: { params: z.object({ board_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(Board) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/boards/{board_id}',
    tags: ['boards'],
    summary: 'Update a board',
    security: bearerAuth,
    request: {
      params: z.object({ board_id: Uuid }),
      body: { content: jsonContent(UpdateBoardInput) },
    },
    responses: {
      200: { description: 'OK', content: jsonContent(Board) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/boards/{board_id}/archive',
    tags: ['boards'],
    summary: 'Archive a board',
    security: bearerAuth,
    request: { params: z.object({ board_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(Board) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/boards/{board_id}/members',
    tags: ['boards'],
    summary: 'List board members',
    security: bearerAuth,
    request: { params: z.object({ board_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(z.array(BoardMembership)) },
      ...errorResponses,
    },
  });
}
