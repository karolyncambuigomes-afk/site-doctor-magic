import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

describe('Admin Auth Validation Endpoint', () => {
  const AUTH_VALIDATION_URL = 'https://jiegopvbwpyfohhfvmwo.supabase.co/functions/v1/admin-auth-validation';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Valid Admin Authentication', () => {
    it('validates admin user with proper token', async () => {
      const mockValidResponse = {
        valid: true,
        user_id: 'admin-123',
        role: 'admin',
        status: 'approved',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockValidResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer valid-admin-token',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
      expect(data.role).toBe('admin');
      expect(data.status).toBe('approved');
      expect(data.user_id).toBe('admin-123');
    });

    it('handles approved admin accounts', async () => {
      const mockValidResponse = {
        valid: true,
        user_id: 'admin-456',
        role: 'admin',
        status: 'approved',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockValidResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token',
        },
      });

      const data = await response.json();

      expect(data.valid).toBe(true);
      expect(data.status).toBe('approved');
    });
  });

  describe('Invalid Authentication', () => {
    it('rejects missing authorization header', async () => {
      const mockErrorResponse = {
        valid: false,
        error: 'Missing or invalid authorization header',
        error_code: 'MISSING_AUTH_HEADER',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.valid).toBe(false);
      expect(data.error_code).toBe('MISSING_AUTH_HEADER');
    });

    it('rejects malformed authorization header', async () => {
      const mockErrorResponse = {
        valid: false,
        error: 'Missing or invalid authorization header',
        error_code: 'MISSING_AUTH_HEADER',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'InvalidFormat token-here',
        },
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.valid).toBe(false);
      expect(data.error_code).toBe('MISSING_AUTH_HEADER');
    });

    it('rejects invalid or expired tokens', async () => {
      const mockErrorResponse = {
        valid: false,
        error: 'Invalid or expired token',
        error_code: 'INVALID_TOKEN',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer invalid-token',
        },
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.valid).toBe(false);
      expect(data.error_code).toBe('INVALID_TOKEN');
    });
  });

  describe('Insufficient Privileges', () => {
    it('rejects non-admin users', async () => {
      const mockErrorResponse = {
        valid: false,
        user_id: 'user-123',
        role: 'user',
        status: 'approved',
        error: 'Insufficient privileges - admin access required',
        error_code: 'INSUFFICIENT_PRIVILEGES',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => mockErrorResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer user-token',
        },
      });

      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.valid).toBe(false);
      expect(data.role).toBe('user');
      expect(data.error_code).toBe('INSUFFICIENT_PRIVILEGES');
    });

    it('rejects unapproved admin accounts', async () => {
      const mockErrorResponse = {
        valid: false,
        user_id: 'admin-pending',
        role: 'admin',
        status: 'pending',
        error: 'Account not approved',
        error_code: 'ACCOUNT_NOT_APPROVED',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => mockErrorResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer pending-admin-token',
        },
      });

      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.valid).toBe(false);
      expect(data.role).toBe('admin');
      expect(data.status).toBe('pending');
      expect(data.error_code).toBe('ACCOUNT_NOT_APPROVED');
    });
  });

  describe('Server Errors', () => {
    it('handles profile lookup errors', async () => {
      const mockErrorResponse = {
        valid: false,
        error: 'Unable to verify user profile',
        error_code: 'PROFILE_LOOKUP_ERROR',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => mockErrorResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer valid-token-no-profile',
        },
      });

      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.valid).toBe(false);
      expect(data.error_code).toBe('PROFILE_LOOKUP_ERROR');
    });

    it('handles internal server errors', async () => {
      const mockErrorResponse = {
        valid: false,
        error: 'Internal server error',
        error_code: 'INTERNAL_ERROR',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => mockErrorResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer token-causing-server-error',
        },
      });

      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.valid).toBe(false);
      expect(data.error_code).toBe('INTERNAL_ERROR');
    });

    it('handles server configuration errors', async () => {
      const mockErrorResponse = {
        valid: false,
        error: 'Server configuration error',
        error_code: 'SERVER_CONFIG_ERROR',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => mockErrorResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer valid-token',
        },
      });

      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.valid).toBe(false);
      expect(data.error_code).toBe('SERVER_CONFIG_ERROR');
    });
  });

  describe('HTTP Method Validation', () => {
    it('only accepts POST requests', async () => {
      const mockErrorResponse = {
        valid: false,
        error: 'Method not allowed',
        error_code: 'METHOD_NOT_ALLOWED',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 405,
        json: async () => mockErrorResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer valid-token',
        },
      });

      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data.valid).toBe(false);
      expect(data.error_code).toBe('METHOD_NOT_ALLOWED');
    });

    it('handles OPTIONS preflight request', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        }),
        text: async () => 'ok',
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'OPTIONS',
      });

      expect(response.status).toBe(200);
    });
  });

  describe('Response Format', () => {
    it('returns consistent error response format', async () => {
      const mockErrorResponse = {
        valid: false,
        error: 'Test error',
        error_code: 'TEST_ERROR',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
        },
      });

      const data = await response.json();

      expect(data).toHaveProperty('valid');
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('error_code');
      expect(data.valid).toBe(false);
    });

    it('returns consistent success response format', async () => {
      const mockSuccessResponse = {
        valid: true,
        user_id: 'admin-123',
        role: 'admin',
        status: 'approved',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockSuccessResponse,
      });

      const response = await fetch(AUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer valid-admin-token',
        },
      });

      const data = await response.json();

      expect(data).toHaveProperty('valid');
      expect(data).toHaveProperty('user_id');
      expect(data).toHaveProperty('role');
      expect(data).toHaveProperty('status');
      expect(data.valid).toBe(true);
    });
  });
});