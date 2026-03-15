/**
 * middleware/errorHandler.middleware.js — Centralised Error Handler
 *
 * Express recognises this as an error-handling middleware because it
 * declares FOUR parameters (err, req, res, next).
 *
 * When any route or middleware calls next(err), Express skips all
 * remaining regular middleware and jumps straight here.
 *
 * Benefits of a central handler:
 *   - One place to format ALL unhandled errors consistently
 *   - Stack traces are hidden from clients in production
 *   - Easy to plug in a logger (e.g. Sentry, Datadog) later
 */

'use strict';

const config = require('../config/app.config');

/**
 * Global error handler — must have exactly 4 parameters.
 *
 * @param {Error}                          err
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next  — required by Express even if unused
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || err.status || 500;

  // Log the full error server-side (never hide it from your own logs)
  console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${err.message}`);

  // Only include the stack trace in development — never expose it in production
  const isDev = config.env !== 'production';

  return res.status(statusCode).json({
    success    : false,
    statusCode,
    message    : err.message || 'An unexpected server error occurred.',
    ...(isDev && { stack: err.stack }), // spread only in development
  });
};

module.exports = errorHandler;
