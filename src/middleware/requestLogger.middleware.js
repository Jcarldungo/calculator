/**
 * middleware/requestLogger.middleware.js — Structured Request Logger
 *
 * Logs every incoming request in a structured format that is easy to
 * read in development and easy to parse by log aggregators in production.
 *
 * This runs IN ADDITION to morgan (which logs after the response). This
 * logger fires BEFORE the response, which is useful for debugging.
 *
 * Example output:
 *   [2024-07-01 12:34:56] --> GET /api/calc/add?a=5&b=3  (::1)
 */

'use strict';

/**
 * Format the current date/time as a readable local timestamp.
 * @returns {string} e.g. "2024-07-01 12:34:56"
 */
const timestamp = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

/**
 * Express middleware — logs method, URL, and client IP for every request.
 *
 * @param {import('express').Request}   req
 * @param {import('express').Response}  res
 * @param {import('express').NextFunction} next
 */
const requestLogger = (req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  console.log(`[${timestamp()}] --> ${req.method} ${req.originalUrl}  (${ip})`);
  next(); // always call next() so the request continues to the route handler
};

module.exports = requestLogger;
