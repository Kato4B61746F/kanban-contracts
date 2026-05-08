import { AuthResponse, LoginInput, RefreshInput, SignupInput, TokenPair } from '../schemas/auth.js';
import { User } from '../schemas/user.js';
import { bearerAuth, errorResponses, jsonContent } from './_helpers.js';
import { registry } from './registry.js';

export function registerAuthPaths(): void {
  registry.registerPath({
    method: 'post',
    path: '/auth/signup',
    tags: ['auth'],
    summary: 'Create a new user account',
    request: {
      body: { content: jsonContent(SignupInput) },
    },
    responses: {
      201: { description: 'Created', content: jsonContent(AuthResponse) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/login',
    tags: ['auth'],
    summary: 'Login with email and password',
    request: {
      body: { content: jsonContent(LoginInput) },
    },
    responses: {
      200: { description: 'OK', content: jsonContent(AuthResponse) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/refresh',
    tags: ['auth'],
    summary: 'Exchange a refresh token for a new token pair',
    request: {
      body: { content: jsonContent(RefreshInput) },
    },
    responses: {
      200: { description: 'OK', content: jsonContent(TokenPair) },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/logout',
    tags: ['auth'],
    summary: 'Revoke the current refresh token',
    security: bearerAuth,
    responses: {
      204: { description: 'No Content' },
      ...errorResponses,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/users/me',
    tags: ['users'],
    summary: 'Get the current authenticated user',
    security: bearerAuth,
    responses: {
      200: { description: 'OK', content: jsonContent(User) },
      ...errorResponses,
    },
  });
}
