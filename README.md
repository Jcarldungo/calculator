# Calculator REST API

A clean, professional **REST API** built with **Node.js** and **Express.js** that performs mathematical calculations. Designed as a portfolio-quality backend project.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Node.js | Runtime |
| Express.js | HTTP framework |
| dotenv | Environment variable management |
| express-rate-limit | Abuse protection |
| morgan | HTTP request logger |
| nodemon | Auto-restart in development |

---

## Project Structure

```
calculator-api/
├── src/
│   ├── app.js                          # Entry point — wires everything together
│   ├── config/
│   │   └── app.config.js               # Central config (reads .env)
│   ├── routes/
│   │   └── calc.routes.js              # Route definitions
│   ├── controllers/
│   │   └── calculator.controller.js    # Request/response handlers
│   ├── services/
│   │   └── calculator.service.js       # Pure calculation logic
│   ├── middleware/
│   │   ├── rateLimiter.middleware.js   # Rate limiting (100 req/min)
│   │   ├── requestLogger.middleware.js # Structured request logging
│   │   └── errorHandler.middleware.js  # Centralized error handling
│   └── utils/
│       ├── response.util.js            # Consistent JSON response helpers
│       └── validate.util.js            # Input validation helpers
├── .env.example                        # Template for environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### 1 — Clone & Install

```bash
git clone https://github.com/your-username/calculator-rest-api.git
cd calculator-rest-api
npm install
```

### 2 — Configure Environment

```bash
cp .env.example .env
# Edit .env if you want to change the PORT or rate limit settings
```

### 3 — Run

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

The server starts at **http://localhost:3000**

---

## API Reference

### Base URL
```
http://localhost:3000/api/calc
```

### Health Check

```
GET /health
```

---

### GET /add
**Addition** — Adds `a` and `b`.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `a` | number | ✅ | First operand |
| `b` | number | ✅ | Second operand |

---

### GET /subtract
**Subtraction** — Subtracts `b` from `a`.

---

### GET /multiply
**Multiplication** — Multiplies `a` by `b`.

---

### GET /divide
**Division** — Divides `a` by `b`. Returns `400` if `b` is `0`.

---

### GET /power
**Exponentiation** — Raises `a` to the power of `b`.

---

### GET /modulo
**Modulo** — Returns the remainder of `a / b`. Returns `400` if `b` is `0`.

---

### POST /evaluate
**Expression Evaluator** — Evaluates a full math expression.

**Request Body:**
```json
{ "expression": "5 + 3 * 2" }
```

Allowed characters: digits, `+`, `-`, `*`, `/`, `^`, `(`, `)`, `.`

---

## Response Format

### Success
```json
{
  "success": true,
  "operation": "addition",
  "inputs": { "a": 5, "b": 3 },
  "result": 8
}
```

### Error
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Division by zero is not allowed."
}
```

---

## Example Requests

### curl

```bash
# Addition
curl "http://localhost:3000/api/calc/add?a=5&b=3"

# Subtraction
curl "http://localhost:3000/api/calc/subtract?a=10&b=4"

# Multiplication
curl "http://localhost:3000/api/calc/multiply?a=6&b=7"

# Division
curl "http://localhost:3000/api/calc/divide?a=20&b=5"

# Power
curl "http://localhost:3000/api/calc/power?a=2&b=10"

# Modulo
curl "http://localhost:3000/api/calc/modulo?a=10&b=3"

# Expression (POST)
curl -X POST http://localhost:3000/api/calc/evaluate \
  -H "Content-Type: application/json" \
  -d '{"expression": "5 + 3 * 2"}'

# Division by zero (error case)
curl "http://localhost:3000/api/calc/divide?a=10&b=0"

# Health check
curl "http://localhost:3000/health"
```

### Postman

Import this collection manually by creating a new request for each endpoint:

| Method | URL | Notes |
|--------|-----|-------|
| GET | `http://localhost:3000/api/calc/add?a=5&b=3` | |
| GET | `http://localhost:3000/api/calc/subtract?a=10&b=4` | |
| GET | `http://localhost:3000/api/calc/multiply?a=6&b=7` | |
| GET | `http://localhost:3000/api/calc/divide?a=20&b=5` | |
| GET | `http://localhost:3000/api/calc/power?a=2&b=10` | |
| GET | `http://localhost:3000/api/calc/modulo?a=10&b=3` | |
| POST | `http://localhost:3000/api/calc/evaluate` | Body → raw → JSON: `{"expression":"5+3*2"}` |

---

## Rate Limiting

By default the API allows **100 requests per minute per IP address**. When exceeded, the API responds with:

```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests from this IP. Please wait 60 seconds and try again."
}
```

Adjust limits in `.env`:
```
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| `200` | OK — calculation succeeded |
| `400` | Bad Request — invalid input, division/modulo by zero |
| `404` | Not Found — route does not exist |
| `429` | Too Many Requests — rate limit exceeded |
| `500` | Internal Server Error — unexpected server fault |
