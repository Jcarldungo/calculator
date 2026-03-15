/**
 * app.js — Main Application Entry Point
 *
 * Responsibilities:
 *  - Load environment variables
 *  - Create and configure the Express app
 *  - Register global middleware (logging, rate limiting, JSON parsing)
 *  - Mount all API routes
 *  - Register the centralized error handler (must be last)
 *  - Start the HTTP server
 */

'use strict';

// Load .env variables FIRST, before any other imports read process.env
require('dotenv').config();

const express = require('express');
const morgan  = require('morgan');
const path    = require('path');

const config          = require('./config/app.config');
const calcRouter      = require('./routes/calc.routes');
const errorHandler    = require('./middleware/errorHandler.middleware');
const rateLimiter     = require('./middleware/rateLimiter.middleware');
const requestLogger   = require('./middleware/requestLogger.middleware');

// ─── Create Express App ───────────────────────────────────────────────────────
const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────

// Parse incoming JSON request bodies  (needed for POST /evaluate)
app.use(express.json());

// Parse URL-encoded bodies (just in case, good practice)
app.use(express.urlencoded({ extended: false }));

// Serve static frontend files from src/public/
app.use(express.static(path.join(__dirname, 'public')));

// HTTP request logger — uses "dev" format in development, "combined" in production
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

// Custom request logger — writes structured logs (see middleware/requestLogger)
app.use(requestLogger);

// Rate limiter — protects all /api routes from abuse
app.use('/api', rateLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health-check endpoint — useful for DevOps / uptime monitors
app.get('/health', (req, res) => {
  res.status(200).json({
    success : true,
    message : 'Calculator API is running',
    version : config.apiVersion,
    env     : config.env,
  });
});

// Calculator routes — all endpoints live under /api/calc
app.use('/api/calc', calcRouter);

// 404 handler — catches any route that doesn't match above
app.use((req, res) => {
  res.status(404).json({
    success : false,
    message : `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Centralized error handler — MUST be registered last
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log('─────────────────────────────────────────────');
  console.log(`  Calculator REST API`);
  console.log(`  Environment : ${config.env}`);
  console.log(`  Listening   : http://localhost:${config.port}`);
  console.log(`  Base URL    : http://localhost:${config.port}/api/calc`);
  console.log('─────────────────────────────────────────────');
});

module.exports = app; // export for testing
