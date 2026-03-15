/**
 * utils/validate.util.js — Input Validation Helpers
 *
 * Pure utility functions that validate request inputs and return
 * structured error objects instead of throwing directly. Controllers
 * decide what to do with the validation results.
 */

'use strict';

/**
 * Check whether a value is a finite number (not NaN, not Infinity).
 *
 * @param  {*}       value - Any value to test
 * @returns {boolean}
 */
const isValidNumber = (value) => {
  const num = Number(value);
  return value !== '' && value !== null && value !== undefined && isFinite(num);
};

/**
 * Validate that both `a` and `b` query parameters are valid numbers.
 *
 * @param  {*} a - First operand (from req.query)
 * @param  {*} b - Second operand (from req.query)
 * @returns {{ valid: boolean, error: string|null }}
 */
const validateOperands = (a, b) => {
  if (a === undefined || a === '') {
    return { valid: false, error: 'Parameter "a" is required.' };
  }
  if (b === undefined || b === '') {
    return { valid: false, error: 'Parameter "b" is required.' };
  }
  if (!isValidNumber(a)) {
    return { valid: false, error: `Parameter "a" must be a valid number. Received: "${a}"` };
  }
  if (!isValidNumber(b)) {
    return { valid: false, error: `Parameter "b" must be a valid number. Received: "${b}"` };
  }

  return { valid: true, error: null };
};

/**
 * Validate a math expression string (used by POST /evaluate).
 *
 * Only allows digits, spaces, decimal points, and the operators + - * / ^ ( ).
 * This whitelist approach prevents arbitrary code execution via eval().
 *
 * @param  {*} expression - The expression string from the request body
 * @returns {{ valid: boolean, error: string|null }}
 */
const validateExpression = (expression) => {
  if (!expression || typeof expression !== 'string') {
    return { valid: false, error: '"expression" field is required and must be a string.' };
  }

  const trimmed = expression.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: '"expression" cannot be empty.' };
  }

  // Whitelist: allow only safe characters — digits, operators, decimals, parens, spaces
  const safePattern = /^[0-9+\-*/.^() ]+$/;
  if (!safePattern.test(trimmed)) {
    return {
      valid : false,
      error : 'Expression contains invalid characters. Allowed: digits, +  -  *  /  ^  (  )  .',
    };
  }

  return { valid: true, error: null };
};

module.exports = { isValidNumber, validateOperands, validateExpression };
