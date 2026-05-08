import type { z } from 'zod';
import { ErrorResponse } from '../schemas/primitives.js';

export const jsonContent = <T extends z.ZodTypeAny>(schema: T) => ({
  'application/json': { schema },
});

export const errorResponses = {
  400: { description: 'Bad Request', content: jsonContent(ErrorResponse) },
  401: { description: 'Unauthorized', content: jsonContent(ErrorResponse) },
  403: { description: 'Forbidden', content: jsonContent(ErrorResponse) },
  404: { description: 'Not Found', content: jsonContent(ErrorResponse) },
  409: { description: 'Conflict', content: jsonContent(ErrorResponse) },
  422: { description: 'Unprocessable Entity', content: jsonContent(ErrorResponse) },
};

export const bearerAuth = [{ BearerAuth: [] }];
