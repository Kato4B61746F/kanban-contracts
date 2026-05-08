import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { registerAllPaths, registry } from './api/index.js';

export interface BuildOptions {
  version: string;
  servers?: Array<{ url: string; description?: string }>;
}

export function buildOpenApiDocument(options: BuildOptions): OpenAPIObject {
  registerAllPaths();
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'kanban API',
      version: options.version,
      description:
        'Trello-like kanban board API. This document is generated from Zod schemas in @kato4b61746f/kanban-contracts.',
      license: { name: 'MIT' },
    },
    servers: options.servers ?? [
      { url: 'http://localhost:3000', description: 'Local development' },
    ],
  });
}
