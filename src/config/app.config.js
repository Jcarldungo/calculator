/**
 * config/app.config.js — Centralised Application Configuration
 *
 * All runtime settings are derived from environment variables here.
 * The rest of the codebase imports this object instead of reading
 * process.env directly, so there is a single source of truth.
 */

'use strict';

const config = {
  // Server
  port       : parseInt(process.env.PORT, 10) || 3000,
  env        : process.env.NODE_ENV || 'development',

  // API meta
  apiVersion : process.env.API_VERSION   || 'v1',
  apiPrefix  : process.env.API_PREFIX    || '/api/calc',

  // Rate limiting
  rateLimit: {
    windowMs    : parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)    || 60_000, // 1 minute
    maxRequests : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
};

module.exports = config;
