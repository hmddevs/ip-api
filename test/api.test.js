/**
 * IP API - Unit Tests
 *
 * @author HMD Developments, Inc.
 * @license Apache-2.0
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

// Import the handler for testing
const handler = require('../api/index.js');

/**
 * Mock request object factory
 * @param {Object} options - Request options
 * @returns {Object} Mock request object
 */
const createMockRequest = (options = {}) => ({
  method: options.method || 'GET',
  headers: options.headers || {},
  socket: { remoteAddress: options.socketIP || '127.0.0.1' },
  connection: { remoteAddress: options.connectionIP || '127.0.0.1' },
  ip: options.ip || null,
});

/**
 * Mock response object factory
 * @returns {Object} Mock response object with tracking
 */
const createMockResponse = () => {
  const response = {
    statusCode: null,
    headers: {},
    body: null,
    ended: false,

    status(code) {
      this.statusCode = code;
      return this;
    },

    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },

    json(data) {
      this.body = data;
      this.ended = true;
      return this;
    },

    end() {
      this.ended = true;
      return this;
    },
  };

  return response;
};

describe('IP API Handler', () => {
  describe('HTTP Methods', () => {
    it('should handle GET requests successfully', () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body);
      assert.ok(res.body.ip);
    });

    it('should handle OPTIONS requests (CORS preflight)', () => {
      const req = createMockRequest({ method: 'OPTIONS' });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 204);
      assert.strictEqual(res.ended, true);
    });

    it('should handle HEAD requests', () => {
      const req = createMockRequest({ method: 'HEAD' });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.ended, true);
    });

    it('should reject POST requests with 405', () => {
      const req = createMockRequest({ method: 'POST' });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 405);
      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.error.code, 'METHOD_NOT_ALLOWED');
    });

    it('should reject PUT requests with 405', () => {
      const req = createMockRequest({ method: 'PUT' });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 405);
    });

    it('should reject DELETE requests with 405', () => {
      const req = createMockRequest({ method: 'DELETE' });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 405);
    });
  });

  describe('IP Extraction', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const req = createMockRequest({
        method: 'GET',
        headers: { 'x-forwarded-for': '8.8.8.8, 10.0.0.1' },
      });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.ip, '8.8.8.8');
    });

    it('should extract IP from x-real-ip header', () => {
      const req = createMockRequest({
        method: 'GET',
        headers: { 'x-real-ip': '1.2.3.4' },
      });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.ip, '1.2.3.4');
    });

    it('should extract IP from cf-connecting-ip header (Cloudflare)', () => {
      const req = createMockRequest({
        method: 'GET',
        headers: { 'cf-connecting-ip': '5.6.7.8' },
      });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.ip, '5.6.7.8');
    });

    it('should normalize IPv6-mapped IPv4 addresses', () => {
      const req = createMockRequest({
        method: 'GET',
        headers: { 'x-forwarded-for': '::ffff:192.168.1.1' },
      });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.ip, '192.168.1.1');
    });

    it('should fallback to socket remote address', () => {
      const req = createMockRequest({
        method: 'GET',
        headers: {},
        socketIP: '10.20.30.40',
      });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.ip);
    });
  });

  describe('Response Headers', () => {
    it('should set CORS headers', () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.headers['Access-Control-Allow-Origin'], '*');
      assert.ok(res.headers['Access-Control-Allow-Methods'].includes('GET'));
    });

    it('should set cache headers', () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      handler(req, res);

      assert.ok(res.headers['Cache-Control']);
      assert.ok(res.headers['Cache-Control'].includes('public'));
    });

    it('should set content type header', () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      handler(req, res);

      assert.ok(res.headers['Content-Type'].includes('application/json'));
    });

    it('should set API version header', () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      handler(req, res);

      assert.ok(res.headers['X-API-Version']);
    });

    it('should set response time header', () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      handler(req, res);

      assert.ok(res.headers['X-Response-Time']);
      assert.ok(res.headers['X-Response-Time'].includes('ms'));
    });
  });

  describe('Response Structure', () => {
    it('should return ip and country fields', () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.ok('ip' in res.body);
      assert.ok('country' in res.body);
    });

    it('should return country as null for unknown/private IPs', () => {
      const req = createMockRequest({
        method: 'GET',
        headers: { 'x-forwarded-for': '192.168.1.1' },
      });
      const res = createMockResponse();

      handler(req, res);

      // Private IPs won't have geolocation data
      assert.strictEqual(res.body.country, null);
    });
  });
});

describe('IP Validation', () => {
  it('should accept valid IPv4 addresses', () => {
    const validIPs = ['8.8.8.8', '192.168.1.1', '10.0.0.1', '255.255.255.255', '0.0.0.0'];

    for (const ip of validIPs) {
      const req = createMockRequest({
        method: 'GET',
        headers: { 'x-forwarded-for': ip },
      });
      const res = createMockResponse();

      handler(req, res);

      assert.strictEqual(res.statusCode, 200, `Failed for IP: ${ip}`);
      assert.strictEqual(res.body.ip, ip);
    }
  });

  it('should skip invalid IPs in x-forwarded-for chain', () => {
    const req = createMockRequest({
      method: 'GET',
      headers: { 'x-forwarded-for': 'invalid, 8.8.8.8' },
    });
    const res = createMockResponse();

    handler(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.ip, '8.8.8.8');
  });
});
