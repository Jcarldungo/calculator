/**
 * utils/response.util.js — Standardised HTTP Response Helpers
 *
 * Every endpoint in this project calls one of these helpers so that
 * the JSON shape is 100 % consistent across the entire API.
 *
 * Success shape:
 *   { success: true,  operation: "addition", result: 8, ... }
 *
 * Error shape:
 *   { success: false, message: "...", statusCode: 400 }
 */

'use strict';

/**
 * Send a successful calculation response.
 *
 * @param {import('express').Response} res         - Express response object
 * @param {object}  payload
 * @param {string}  payload.operation              - Human-readable operation name
 * @param {number}  payload.result                 - The computed result
 * @param {object}  [payload.inputs]               - Echo the inputs back (optional)
 * @param {number}  [statusCode=200]               - HTTP status code
 */
const sendSuccess = (res, { operation, result, inputs = {} }, statusCode = 200) => {
  return res.status(statusCode).json({
    success  : true,
    operation,
    inputs,
    result,
  });
};

/**
 * Send an error response.
 *
 * @param {import('express').Response} res  - Express response object
 * @param {string}  message                 - Developer-friendly error message
 * @param {number}  [statusCode=400]        - HTTP status code
 */
const sendError = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success    : false,
    statusCode,
    message,
  });
};

module.exports = { sendSuccess, sendError };
