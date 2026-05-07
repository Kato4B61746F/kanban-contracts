import { z } from 'zod';
import { IsoDateTime, Slug, Uuid } from './primitives.js';

export const WorkspaceRole = z.enum(['owner', 'admin', 'member']).openapi('WorkspaceRole');
export type WorkspaceRole = z.infer<typeof WorkspaceRole>;

export const Workspace = z
  .object({
    id: Uuid,
    name: z.string().min(1).max(64),
    slug: Slug,
    owner_id: Uuid,
    created_at: IsoDateTime,
    updated_at: IsoDateTime,
  })
  .openapi('Workspace');

export type Workspace = z.infer<typeof Workspace>;

export const WorkspaceMembership = z
  .object({
    workspace_id: Uuid,
    user_id: Uuid,
    role: WorkspaceRole,
    joined_at: IsoDateTime,
  })
  .openapi('WorkspaceMembership');

export type WorkspaceMembership = z.infer<typeof WorkspaceMembership>;

export const CreateWorkspaceInput = z
  .object({
    name: z.string().min(1).max(64),
    slug: Slug,
  })
  .openapi('CreateWorkspaceInput');

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceInput>;

export const UpdateWorkspaceInput = z
  .object({
    name: z.string().min(1).max(64).optional(),
    slug: Slug.optional(),
  })
  .openapi('UpdateWorkspaceInput');

export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceInput>;
