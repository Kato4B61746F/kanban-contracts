import { z } from 'zod';
import { Uuid } from '../schemas/primitives.js';
import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  Workspace,
  WorkspaceMembership,
} from '../schemas/workspace.js';
import { bearerAuth, errorResponses, jsonContent } from './_helpers.js';
import { registry } from './registry.js';

export function registerWorkspacePaths(): void {
  registry.registerPath({
    method: 'get',
    path: '/workspaces',
    tags: ['workspaces'],
    summary: 'List workspaces the current user belongs to',
    security: bearerAuth,
    responses: {
      200: { description: 'OK', content: jsonContent(z.array(Workspace)) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/workspaces',
    tags: ['workspaces'],
    summary: 'Create a new workspace',
    security: bearerAuth,
    request: {
      body: { content: jsonContent(CreateWorkspaceInput) },
    },
    responses: {
      201: { description: 'Created', content: jsonContent(Workspace) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/workspaces/{workspace_id}',
    tags: ['workspaces'],
    summary: 'Get a workspace',
    security: bearerAuth,
    request: { params: z.object({ workspace_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(Workspace) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/workspaces/{workspace_id}',
    tags: ['workspaces'],
    summary: 'Update a workspace',
    security: bearerAuth,
    request: {
      params: z.object({ workspace_id: Uuid }),
      body: { content: jsonContent(UpdateWorkspaceInput) },
    },
    responses: {
      200: { description: 'OK', content: jsonContent(Workspace) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/workspaces/{workspace_id}',
    tags: ['workspaces'],
    summary: 'Delete a workspace',
    security: bearerAuth,
    request: { params: z.object({ workspace_id: Uuid }) },
    responses: {
      204: { description: 'No Content' },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/workspaces/{workspace_id}/members',
    tags: ['workspaces'],
    summary: 'List workspace members',
    security: bearerAuth,
    request: { params: z.object({ workspace_id: Uuid }) },
    responses: {
      200: { description: 'OK', content: jsonContent(z.array(WorkspaceMembership)) },
      ...errorResponses,
    },
  });
}
