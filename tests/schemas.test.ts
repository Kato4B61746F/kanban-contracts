import { describe, expect, it } from 'vitest';
import {
  Board,
  buildOpenApiDocument,
  Card,
  CreateCardInput,
  MoveCardInput,
  User,
  Workspace,
} from '../src/index.js';

describe('schemas', () => {
  it('User accepts valid input', () => {
    const result = User.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      display_name: 'Test User',
      avatar_url: null,
      created_at: '2026-05-08T00:00:00.000Z',
      updated_at: '2026-05-08T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('User rejects invalid email', () => {
    const result = User.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'not-an-email',
      display_name: 'Test User',
      avatar_url: null,
      created_at: '2026-05-08T00:00:00.000Z',
      updated_at: '2026-05-08T00:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });

  it('Workspace requires kebab-case slug', () => {
    const valid = Workspace.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'My Team',
      slug: 'my-team',
      owner_id: '550e8400-e29b-41d4-a716-446655440001',
      created_at: '2026-05-08T00:00:00.000Z',
      updated_at: '2026-05-08T00:00:00.000Z',
    });
    expect(valid.success).toBe(true);

    const invalid = Workspace.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'My Team',
      slug: 'My Team',
      owner_id: '550e8400-e29b-41d4-a716-446655440001',
      created_at: '2026-05-08T00:00:00.000Z',
      updated_at: '2026-05-08T00:00:00.000Z',
    });
    expect(invalid.success).toBe(false);
  });

  it('Board visibility enum is enforced', () => {
    const result = Board.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      workspace_id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Roadmap',
      description: null,
      background: null,
      visibility: 'invalid',
      archived_at: null,
      created_at: '2026-05-08T00:00:00.000Z',
      updated_at: '2026-05-08T00:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });

  it('Card description can be null', () => {
    const result = Card.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      list_id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Buy milk',
      description: null,
      position: 'a1',
      due_date: null,
      completed_at: null,
      archived_at: null,
      created_by: '550e8400-e29b-41d4-a716-446655440002',
      created_at: '2026-05-08T00:00:00.000Z',
      updated_at: '2026-05-08T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('CreateCardInput allows minimal payload', () => {
    const result = CreateCardInput.safeParse({
      list_id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'New card',
    });
    expect(result.success).toBe(true);
  });

  it('MoveCardInput requires target_list_id', () => {
    const missing = MoveCardInput.safeParse({ after_card_id: null });
    expect(missing.success).toBe(false);

    const ok = MoveCardInput.safeParse({
      target_list_id: '550e8400-e29b-41d4-a716-446655440000',
      after_card_id: null,
    });
    expect(ok.success).toBe(true);
  });
});

describe('OpenAPI generation', () => {
  it('builds a valid OpenAPI 3.1 document', () => {
    const doc = buildOpenApiDocument({ version: '0.0.1' });
    expect(doc.openapi).toBe('3.1.0');
    expect(doc.info.title).toBe('kanban API');
    expect(doc.paths).toBeDefined();
    expect(doc.paths!['/auth/login']).toBeDefined();
    expect(doc.paths!['/cards/{card_id}/move']).toBeDefined();
    expect(doc.components?.schemas?.Card).toBeDefined();
  });
});
