/**
 * routes/calc.routes.js — Calculator API Route Definitions
 *
 * This file only maps HTTP methods + paths to controller functions.
 * No logic lives here — that belongs in controllers and services.
 *
 * All routes below are mounted at /api/calc in app.js, so:
 *   router.get('/add')  →  GET /api/calc/add
 */

'use strict';

const { Router } = require('express');
const ctrl       = require('../controllers/calculator.controller');

const router = Router();

// ── Arithmetic endpoints (query params: ?a=&b=) ───────────────────────────────

/** GET /api/calc/add?a=5&b=3          → addition         */
router.get('/add',      ctrl.addNumbers);

/** GET /api/calc/subtract?a=10&b=4   → subtraction      */
router.get('/subtract', ctrl.subtractNumbers);

/** GET /api/calc/multiply?a=6&b=7    → multiplication   */
router.get('/multiply', ctrl.multiplyNumbers);

/** GET /api/calc/divide?a=20&b=5     → division         */
router.get('/divide',   ctrl.divideNumbers);

/** GET /api/calc/power?a=2&b=3       → exponentiation   */
router.get('/power',    ctrl.powerNumbers);

/** GET /api/calc/modulo?a=10&b=3     → modulo / remainder */
router.get('/modulo',   ctrl.moduloNumbers);

// ── Expression endpoint (JSON body) ──────────────────────────────────────────

/** POST /api/calc/evaluate  body: { "expression": "5 + 3 * 2" } */
router.post('/evaluate', ctrl.evaluateExpression);

module.exports = router;
