import { z } from 'zod';
import {
  Card,
  CardAssignee,
  CreateCardInput,
  MoveCardInput,
  UpdateCardInput,
} from '../schemas/card.js';
import { CardLabel } from '../schemas/label.js';
import { Uuid } from '../schemas/primitives.js';
import { bearerAuth, errorResponses, jsonContent } from './_helpers.js';
import { registry } from './registry.js';

export function registerCardPaths(): void {
  registry.registerPath({
    method: 'get',
    path: '/lists/{list_id}/cards',
    tags: ['cards'],
    summary: 'List cards in a list (in position order)',
    security: bearerAuth,
    request: { params: z.object({ list_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(z.array(Card)) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/cards',
    tags: ['cards'],
    summary: 'Create a card',
    security: bearerAuth,
    request: { body: { content: jsonContent(CreateCardInput) } },
    responses: {
      201: { description: 'Created', content: jsonContent(Card) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/cards/{card_id}',
    tags: ['cards'],
    summary: 'Get a card',
    security: bearerAuth,
    request: { params: z.object({ card_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(Card) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/cards/{card_id}',
    tags: ['cards'],
    summary: 'Update a card',
    security: bearerAuth,
    request: {
      params: z.object({ card_id: Uuid }),
      body: { content: jsonContent(UpdateCardInput) },
    },
    responses: {
      200: { description: 'OK', content: jsonContent(Card) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/cards/{card_id}/move',
    tags: ['cards'],
    summary: 'Move a card to another list and/or position',
    security: bearerAuth,
    request: {
      params: z.object({ card_id: Uuid }),
      body: { content: jsonContent(MoveCardInput) },
    },
    responses: {
      200: { description: 'OK', content: jsonContent(Card) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/cards/{card_id}/archive',
    tags: ['cards'],
    summary: 'Archive a card',
    security: bearerAuth,
    request: { params: z.object({ card_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(Card) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/cards/{card_id}/assignees',
    tags: ['cards'],
    summary: 'List card assignees',
    security: bearerAuth,
    request: { params: z.object({ card_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(z.array(CardAssignee)) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'put',
    path: '/cards/{card_id}/assignees/{user_id}',
    tags: ['cards'],
    summary: 'Assign a user to a card',
    security: bearerAuth,
    request: { params: z.object({ card_id: Uuid, user_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(CardAssignee) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/cards/{card_id}/assignees/{user_id}',
    tags: ['cards'],
    summary: 'Unassign a user from a card',
    security: bearerAuth,
    request: { params: z.object({ card_id: Uuid, user_id: Uuid }) },
    responses: {
      204: { description: 'No Content' },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'put',
    path: '/cards/{card_id}/labels/{label_id}',
    tags: ['cards'],
    summary: 'Apply a label to a card',
    security: bearerAuth,
    request: { params: z.object({ card_id: Uuid, label_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(CardLabel) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/cards/{card_id}/labels/{label_id}',
    tags: ['cards'],
    summary: 'Remove a label from a card',
    security: bearerAuth,
    request: { params: z.object({ card_id: Uuid, label_id: Uuid }) },
    responses: {
      204: { description: 'No Content' },
      ...errorResponses,
    },
  });
}
