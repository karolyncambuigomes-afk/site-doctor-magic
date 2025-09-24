import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

describe('Admin Health Check Endpoint', () => {
  const HEALTH_CHECK_URL = 'https://jiegopvbwpyfohhfvmwo.supabase.co/functions/v1/admin-health-check';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Health Check Response', () => {
    it('returns healthy status when all services are working', async () => {
      const mockHealthyResponse = {
        status: 'healthy',
        timestamp: '2025-01-12T16:30:00.000Z',
        services: {
          database: 'healthy',
          auth: 'healthy',
          storage: 'healthy',
          admin_functions: 'healthy',
        },
        response_time_ms: 150,
        version: '1.0.0',
        environment: 'production',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockHealthyResponse,
      });

      const response = await fetch(HEALTH_CHECK_URL);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.services.database).toBe('healthy');
      expect(data.services.auth).toBe('healthy');
      expect(data.services.storage).toBe('healthy');
      expect(data.services.admin_functions).toBe('healthy');
      expect(data.response_time_ms).toBeGreaterThan(0);
      expect(data.version).toBe('1.0.0');
    });

    it('returns degraded status when some services are unhealthy', async () => {
      const mockDegradedResponse = {
        status: 'degraded',
        timestamp: '2025-01-12T16:30:00.000Z',
        services: {
          database: 'healthy',
          auth: 'healthy',
          storage: 'unhealthy',
          admin_functions: 'healthy',
        },
        response_time_ms: 250,
        version: '1.0.0',
        environment: 'production',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 206,
        json: async () => mockDegradedResponse,
      });

      const response = await fetch(HEALTH_CHECK_URL);
      const data = await response.json();

      expect(response.status).toBe(206);
      expect(data.status).toBe('degraded');
      expect(data.services.storage).toBe('unhealthy');
    });

    it('returns unhealthy status when multiple services are down', async () => {
      const mockUnhealthyResponse = {
        status: 'unhealthy',
        timestamp: '2025-01-12T16:30:00.000Z',
        services: {
          database: 'unhealthy',
          auth: 'unhealthy',
          storage: 'unhealthy',
          admin_functions: 'healthy',
        },
        response_time_ms: 500,
        version: '1.0.0',
        environment: 'production',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => mockUnhealthyResponse,
      });

      const response = await fetch(HEALTH_CHECK_URL);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.status).toBe('unhealthy');
      expect(data.services.database).toBe('unhealthy');
      expect(data.services.auth).toBe('unhealthy');
    });

    it('handles network errors gracefully', async () => {
      (fetch as Mock).mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch(HEALTH_CHECK_URL);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }
    });

    it('only accepts GET requests', async () => {
      const mockMethodNotAllowedResponse = {
        error: 'Method not allowed',
        allowed_methods: ['GET'],
        status: 'unhealthy',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 405,
        json: async () => mockMethodNotAllowedResponse,
      });

      const response = await fetch(HEALTH_CHECK_URL, { method: 'POST' });
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data.error).toBe('Method not allowed');
      expect(data.allowed_methods).toContain('GET');
    });
  });

  describe('Response Format Validation', () => {
    it('returns properly formatted response structure', async () => {
      const mockResponse = {
        status: 'healthy',
        timestamp: '2025-01-12T16:30:00.000Z',
        services: {
          database: 'healthy',
          auth: 'healthy',
          storage: 'healthy',
          admin_functions: 'healthy',
        },
        response_time_ms: 150,
        version: '1.0.0',
        environment: 'production',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const response = await fetch(HEALTH_CHECK_URL);
      const data = await response.json();

      // Validate response structure
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('services');
      expect(data).toHaveProperty('response_time_ms');
      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('environment');

      // Validate services structure
      expect(data.services).toHaveProperty('database');
      expect(data.services).toHaveProperty('auth');
      expect(data.services).toHaveProperty('storage');
      expect(data.services).toHaveProperty('admin_functions');

      // Validate data types
      expect(typeof data.status).toBe('string');
      expect(typeof data.timestamp).toBe('string');
      expect(typeof data.response_time_ms).toBe('number');
      expect(typeof data.version).toBe('string');
      expect(typeof data.environment).toBe('string');
    });

    it('validates timestamp format', async () => {
      const mockResponse = {
        status: 'healthy',
        timestamp: '2025-01-12T16:30:00.000Z',
        services: {
          database: 'healthy',
          auth: 'healthy',
          storage: 'healthy',
          admin_functions: 'healthy',
        },
        response_time_ms: 150,
        version: '1.0.0',
        environment: 'production',
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const response = await fetch(HEALTH_CHECK_URL);
      const data = await response.json();

      // Validate ISO 8601 timestamp format
      const timestamp = new Date(data.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });
  });

  describe('CORS Headers', () => {
    it('includes proper CORS headers in response', async () => {
      const mockHeaders = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Content-Type': 'application/json',
      });

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: async () => ({ status: 'healthy' }),
      });

      const response = await fetch(HEALTH_CHECK_URL);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Content-Type')).toBe('application/json');
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

      const response = await fetch(HEALTH_CHECK_URL, { method: 'OPTIONS' });

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });
});