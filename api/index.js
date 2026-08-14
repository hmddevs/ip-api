/**
 * IP API - A lightning-fast, privacy-focused IP geolocation API
 *
 * @author HMD Developments, Inc.
 * @license Apache-2.0
 * @see https://github.com/hmddevs/ip-api
 * @version 1.0.0
 */

'use strict';

const geoip = require('geoip-lite');

/**
 * API version for response headers
 * @constant {string}
 */
const API_VERSION = '1.0.0';

/**
 * Regular expression patterns for IP validation
 * @constant {Object}
 */
const IP_PATTERNS = {
  // IPv4: 0.0.0.0 to 255.255.255.255
  IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  // IPv6: Full and compressed formats
  IPV6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){0,6}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$/,
  // IPv6-mapped IPv4: ::ffff:x.x.x.x
  IPV6_MAPPED: /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i,
};

/**
 * HTTP headers to check for client IP (in order of priority)
 * @constant {string[]}
 */
const IP_HEADERS = [
  'x-forwarded-for',
  'x-real-ip',
  'x-client-ip',
  'cf-connecting-ip', // Cloudflare
  'x-cluster-client-ip', // Rackspace/Riverbed
  'x-forwarded',
  'forwarded-for',
  'true-client-ip', // Akamai/Cloudflare Enterprise
];

/**
 * Validates if a string is a valid IP address (IPv4 or IPv6)
 * @param {string} ip - The IP address to validate
 * @returns {boolean} True if valid IP address
 */
const isValidIP = (ip) => {
  if (!ip || typeof ip !== 'string') {
    return false;
  }
  return IP_PATTERNS.IPV4.test(ip) || IP_PATTERNS.IPV6.test(ip) || IP_PATTERNS.IPV6_MAPPED.test(ip);
};

/**
 * Extracts the client's IP address from the request
 * @param {Object} req - The HTTP request object
 * @returns {string} The client's IP address
 */
const getClientIP = (req) => {
  // Check headers in priority order
  for (const header of IP_HEADERS) {
    const value = req.headers[header];
    if (value) {
      // x-forwarded-for may contain multiple IPs; extract the first valid one
      const ips = value.split(',').map((ip) => ip.trim());
      for (const ip of ips) {
        if (isValidIP(ip)) {
          return ip;
        }
      }
    }
  }

  // Fallback to socket/connection remote address
  const socketIP =
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip;

  return socketIP || null;
};

/**
 * Normalizes IPv6-mapped IPv4 addresses to standard IPv4 format
 * @param {string} ip - The IP address to normalize
 * @returns {string} The normalized IP address
 */
const normalizeIP = (ip) => {
  if (!ip) {
    return null;
  }

  // Handle IPv6-mapped IPv4 addresses (e.g., ::ffff:192.168.1.1)
  const mappedMatch = ip.match(IP_PATTERNS.IPV6_MAPPED);
  if (mappedMatch) {
    return mappedMatch[1];
  }

  // Handle prefixed format
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }

  return ip;
};

/**
 * Builds the JSON response object
 * @param {string} ip - The client IP address
 * @param {Object|null} geo - The geolocation data
 * @returns {Object} The response object
 */
const buildResponse = (ip, geo) => {
  const response = {
    ip: ip || 'unknown',
    country: geo?.country || null,
  };

  return response;
};

/**
 * Sets common response headers
 * @param {Object} res - The HTTP response object
 */
const setResponseHeaders = (res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Cache headers
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=30');
  res.setHeader('Vary', 'Accept-Encoding');

  // Content headers
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Custom headers
  res.setHeader('X-API-Version', API_VERSION);
  res.setHeader('X-Powered-By', 'HMD Developments');
};

/**
 * Main API handler
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @returns {Object} The HTTP response
 */
module.exports = (req, res) => {
  const startTime = Date.now();

  // Set response headers
  setResponseHeaders(res);

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Handle HEAD requests (same as GET but no body)
  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only GET, HEAD, and OPTIONS methods are supported',
      },
    });
  }

  try {
    // Extract and normalize the client IP
    const rawIP = getClientIP(req);
    const ip = normalizeIP(rawIP);

    // Validate IP
    if (!ip) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'IP_DETECTION_FAILED',
          message: 'Unable to determine client IP address',
        },
      });
    }

    // Lookup geolocation data
    const geo = geoip.lookup(ip);

    // Build and return the response
    const response = buildResponse(ip, geo);

    // Add response time header
    res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`);

    return res.status(200).json(response);
  } catch (error) {
    // Log error for debugging (in production, use proper logging)
    console.error('[IP-API Error]:', error.message);

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
};
