/**
 * middleware/rateLimiter.middleware.js — Rate Limiting
 *
 * Uses the "express-rate-limit" package to cap the number of requests
 * a single IP address can make within a sliding time window.
 *
 * Why rate limit?
 *   - Prevents abuse / denial-of-service attacks
 *   - Encourages fair use of the API
 *   - A must-have for any production or portfolio API
 *
 * Configuration is read from app.config.js so it can be changed via
 * environment variables without touching code.
 */

'use strict';

const rateLimit = require('express-rate-limit');
const config    = require('../config/app.config');

const rateLimiter = rateLimit({
  // Time window length (default: 1 minute)
  windowMs : config.rateLimit.windowMs,

  // Maximum requests per IP per window (default: 100)
  max : config.rateLimit.maxRequests,

  // Send a standard HTTP 429 (Too Many Requests) when exceeded
  standardHeaders : true,   // Include RateLimit-* headers in the response
  legacyHeaders   : false,  // Disable the deprecated X-RateLimit-* headers

  // Custom error message matching our API's response format
  handler : (req, res) => {
    res.status(429).json({
      success    : false,
      statusCode : 429,
      message    : `Too many requests from this IP. ` +
                   `Please wait ${Math.ceil(config.rateLimit.windowMs / 1000)} seconds and try again.`,
    });
  },
});

module.exports = rateLimiter;
