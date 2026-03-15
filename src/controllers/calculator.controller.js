/**
 * controllers/calculator.controller.js — Request / Response Handlers
 *
 * Controllers sit between routes and services.
 * Their only jobs are:
 *   1. Extract data from the request (query params, body)
 *   2. Validate that data (using validate.util)
 *   3. Call the appropriate service function
 *   4. Format and send the HTTP response (using response.util)
 *   5. Forward unexpected errors to the centralised error handler via next()
 */

'use strict';

const calcService   = require('../services/calculator.service');
const { sendSuccess, sendError }       = require('../utils/response.util');
const { validateOperands, validateExpression } = require('../utils/validate.util');

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Parse both operands from query string and coerce to Number.
 * Assumes validateOperands() has already been called and passed.
 */
const parseOperands = (query) => ({
  a: Number(query.a),
  b: Number(query.b),
});

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * GET /api/calc/add?a=5&b=3
 */
const addNumbers = (req, res, next) => {
  try {
    const { valid, error } = validateOperands(req.query.a, req.query.b);
    if (!valid) return sendError(res, error, 400);

    const { a, b } = parseOperands(req.query);
    const { result } = calcService.add(a, b);

    return sendSuccess(res, {
      operation : 'addition',
      inputs    : { a, b },
      result,
    });
  } catch (err) {
    next(err); // passes to centralised error handler
  }
};

/**
 * GET /api/calc/subtract?a=10&b=4
 */
const subtractNumbers = (req, res, next) => {
  try {
    const { valid, error } = validateOperands(req.query.a, req.query.b);
    if (!valid) return sendError(res, error, 400);

    const { a, b } = parseOperands(req.query);
    const { result } = calcService.subtract(a, b);

    return sendSuccess(res, {
      operation : 'subtraction',
      inputs    : { a, b },
      result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/calc/multiply?a=6&b=7
 */
const multiplyNumbers = (req, res, next) => {
  try {
    const { valid, error } = validateOperands(req.query.a, req.query.b);
    if (!valid) return sendError(res, error, 400);

    const { a, b } = parseOperands(req.query);
    const { result } = calcService.multiply(a, b);

    return sendSuccess(res, {
      operation : 'multiplication',
      inputs    : { a, b },
      result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/calc/divide?a=20&b=5
 */
const divideNumbers = (req, res, next) => {
  try {
    const { valid, error } = validateOperands(req.query.a, req.query.b);
    if (!valid) return sendError(res, error, 400);

    const { a, b } = parseOperands(req.query);
    // calcService.divide() throws if b === 0
    const { result } = calcService.divide(a, b);

    return sendSuccess(res, {
      operation : 'division',
      inputs    : { a, b },
      result,
    });
  } catch (err) {
    // Division-by-zero error from the service is a 400 (bad input), not a 500
    if (err.message.includes('Division by zero')) {
      return sendError(res, err.message, 400);
    }
    next(err);
  }
};

/**
 * GET /api/calc/power?a=2&b=3
 */
const powerNumbers = (req, res, next) => {
  try {
    const { valid, error } = validateOperands(req.query.a, req.query.b);
    if (!valid) return sendError(res, error, 400);

    const { a, b } = parseOperands(req.query);
    const { result } = calcService.power(a, b);

    return sendSuccess(res, {
      operation : 'power',
      inputs    : { a, b },
      result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/calc/modulo?a=10&b=3
 */
const moduloNumbers = (req, res, next) => {
  try {
    const { valid, error } = validateOperands(req.query.a, req.query.b);
    if (!valid) return sendError(res, error, 400);

    const { a, b } = parseOperands(req.query);
    const { result } = calcService.modulo(a, b);

    return sendSuccess(res, {
      operation : 'modulo',
      inputs    : { a, b },
      result,
    });
  } catch (err) {
    if (err.message.includes('Modulo by zero')) {
      return sendError(res, err.message, 400);
    }
    next(err);
  }
};

/**
 * POST /api/calc/evaluate
 * Body: { "expression": "5 + 3 * 2" }
 */
const evaluateExpression = (req, res, next) => {
  try {
    const { expression } = req.body;

    const { valid, error } = validateExpression(expression);
    if (!valid) return sendError(res, error, 400);

    const { result } = calcService.evaluate(expression.trim());

    return sendSuccess(res, {
      operation : 'expression evaluation',
      inputs    : { expression: expression.trim() },
      result,
    });
  } catch (err) {
    // Expression evaluation errors are client errors (400), not server errors (500)
    return sendError(res, err.message, 400);
  }
};

module.exports = {
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers,
  powerNumbers,
  moduloNumbers,
  evaluateExpression,
};
