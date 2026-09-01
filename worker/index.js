/**
 * IP API - A lightning-fast, privacy-focused IP geolocation API
 *
 * Cloudflare Workers runtime. The client IP comes from CF-Connecting-IP and the
 * country from request.cf, so no local geolocation database is needed.
 *
 * @author HMD Developments, Inc.
 * @license Apache-2.0
 * @see https://github.com/hmddevs/ip-api
 */

const API_VERSION = '1.0.0';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'X-DNS-Prefetch-Control': 'off',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

const baseHeaders = () =>
  new Headers({
    ...SECURITY_HEADERS,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=30',
    Vary: 'Accept-Encoding',
    'Content-Type': 'application/json; charset=utf-8',
    'X-API-Version': API_VERSION,
    'X-Powered-By': 'HMD Developments',
  });

const json = (body, status, headers) =>
  new Response(JSON.stringify(body), { status, headers });

export default {
  async fetch(request) {
    const start = Date.now();
    const headers = baseHeaders();

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method === 'HEAD') return new Response(null, { status: 200, headers });

    if (request.method !== 'GET') {
      return json(
        {
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Only GET, HEAD, and OPTIONS methods are supported',
          },
        },
        405,
        headers,
      );
    }

    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim();

    if (!ip) {
      return json(
        {
          success: false,
          error: {
            code: 'IP_DETECTION_FAILED',
            message: 'Unable to determine client IP address',
          },
        },
        400,
        headers,
      );
    }

    headers.set('X-Response-Time', `${Date.now() - start}ms`);
    return json({ ip, country: request.cf?.country ?? null }, 200, headers);
  },
};
