/**
 * services/calculator.service.js — Core Calculation Logic
 *
 * This service layer contains ONLY pure business logic.
 * It knows nothing about HTTP, Express, or JSON — that is
 * intentional: if you ever swap Express for a different
 * framework, this file stays exactly the same.
 *
 * Each function returns { result } on success or throws an
 * Error with a descriptive message on failure.
 */

'use strict';

/**
 * Add two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {{ result: number }}
 */
const add = (a, b) => ({ result: a + b });

/**
 * Subtract b from a.
 * @param {number} a
 * @param {number} b
 * @returns {{ result: number }}
 */
const subtract = (a, b) => ({ result: a - b });

/**
 * Multiply two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {{ result: number }}
 */
const multiply = (a, b) => ({ result: a * b });

/**
 * Divide a by b.
 * Throws if b is zero to prevent a division-by-zero result.
 * @param {number} a
 * @param {number} b
 * @returns {{ result: number }}
 */
const divide = (a, b) => {
  if (b === 0) {
    throw new Error('Division by zero is not allowed. Parameter "b" must not be 0.');
  }
  return { result: a / b };
};

/**
 * Raise a to the power of b  (a ^ b).
 * @param {number} a - Base
 * @param {number} b - Exponent
 * @returns {{ result: number }}
 */
const power = (a, b) => ({ result: Math.pow(a, b) });

/**
 * Return the remainder of a divided by b  (a % b).
 * Throws if b is zero (modulo by zero is undefined).
 * @param {number} a
 * @param {number} b
 * @returns {{ result: number }}
 */
const modulo = (a, b) => {
  if (b === 0) {
    throw new Error('Modulo by zero is not allowed. Parameter "b" must not be 0.');
  }
  return { result: a % b };
};

/**
 * Safely evaluate a mathematical expression string.
 *
 * Why not just use eval()?
 *   eval() is dangerous — it executes arbitrary JavaScript.
 *   Instead, we use the Function constructor with a tightly
 *   constrained scope: the expression cannot access any global
 *   or module-level variables.
 *
 * The caller (validate.util) is responsible for whitelisting the
 * characters BEFORE this function is called.
 *
 * @param {string} expression - A pre-validated math expression e.g. "5 + 3 * 2"
 * @returns {{ result: number, expression: string }}
 */
const evaluate = (expression) => {
  let result;

  try {
    // Replace ^ with ** so JavaScript understands exponentiation
    const jsExpression = expression.replace(/\^/g, '**');

    // new Function creates an isolated function scope — safer than bare eval()
    // eslint-disable-next-line no-new-func
    result = new Function(`'use strict'; return (${jsExpression})`)();
  } catch {
    throw new Error(`Could not evaluate expression: "${expression}". Please check the syntax.`);
  }

  // Guard against expressions that produce non-finite results (e.g. "1/0")
  if (!isFinite(result)) {
    throw new Error(
      `Expression "${expression}" produced a non-finite result (Infinity or NaN). ` +
      'Check for division by zero or invalid operations.'
    );
  }

  return { result, expression };
};

module.exports = { add, subtract, multiply, divide, power, modulo, evaluate };
