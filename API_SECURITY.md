# API Security & Best Practices

## Overview

This document outlines the security implementation, best practices, and guidelines for Stadium-GPT APIs.

---

## 1. Security Headers

### Implemented Headers

All API responses include the following security headers:

```
X-Content-Type-Options: nosniff
├─ Prevents MIME type sniffing attacks
├─ Blocks downloads of incorrect MIME type
└─ Recommended by OWASP

X-Frame-Options: DENY
├─ Prevents clickjacking attacks
├─ Disallows embedding in iframes
└─ Protects against UI redressing

X-XSS-Protection: 1; mode=block
├─ Enables browser XSS protection
├─ Blocks page if XSS attack detected
└─ Legacy but effective defense layer

Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' https:; connect-src 'self' https://api.openai.com
├─ Restricts resource loading
├─ Prevents inline script execution
└─ Whitelists trusted sources only

Referrer-Policy: strict-origin-when-cross-origin
├─ Controls referrer information
├─ Prevents sensitive data leakage
└─ Only sends domain on cross-origin requests

Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
├─ Restricts browser APIs
├─ Disables unnecessary features
└─ Reduces attack surface
```

---

## 2. Input Validation & Sanitization

### Validation Pipeline

```typescript
1. Schema Validation (Zod)
   └─ Type checking
   └─ Format validation
   └─ Length validation

2. Sanitization (sanitizeInput)
   └─ HTML entity encoding
   └─ Script tag removal
   └─ Prompt injection prevention

3. Rate Limiting
   └─ Request throttling (30 req/min per IP)
   └─ Graceful rejection with 429 status

4. Error Handling
   └─ No information leakage
   └─ User-friendly messages
   └─ Structured logging
```

### Example: Chat API Input

```typescript
// Input Validation
const ChatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  module: z.enum(['navigation', 'crowd', 'multilingual', ...]),
  stadium: z.string().uuid().optional(),
});

// Sanitization
const sanitized = sanitizeInput(input.message);

// XSS Prevention
const xssPatterns = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
];
```

---

## 3. Rate Limiting Strategy

### Configuration

```typescript
RateLimiter(maxRequests, windowMs)
├─ Default: 30 requests per 60,000ms (1 minute)
├─ Per IP address tracking
└─ Sliding window algorithm

// Response Headers
Retry-After: <seconds>
└─ Informs client when to retry
```

### Behavior

```
Request 1-30:  ✅ Allowed
Request 31:    ❌ Rejected (429 Too Many Requests)
Request 32+:   ❌ Rejected until window resets
```

### Use Cases

- **Chat API**: 30 req/min per user
- **Health Check**: 100 req/min per user
- **Metrics API**: 50 req/min per user

---

## 4. Authentication & Authorization

### Current Implementation

- **Status**: API keys in environment variables
- **Protection**: Lazy client initialization
- **Fallback**: Demo mode when key missing

### Recommended Enhancements

```typescript
// Option 1: JWT Tokens
const token = jwt.sign(
  { sub: userId, module: 'chat' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Option 2: API Keys with Scope
const apiKey = {
  key: 'sk_live_...',
  scopes: ['chat:write', 'metrics:read'],
  rateLimit: 100,
  expiresAt: '2026-12-31'
};

// Option 3: OAuth2 (for user context)
// Implement with NextAuth.js for multi-user support
```

---

## 5. API Endpoints

### POST /api/chat

**Purpose**: Stream AI responses for various modules

**Authentication**: Optional (uses demo mode if missing)

**Rate Limit**: 30 req/min per IP

**Request Validation**:
```typescript
{
  message: string (1-2000 chars),
  module: 'navigation' | 'crowd' | 'multilingual' | ... (required),
  stadium?: UUID (optional),
  language?: ISO 639-1 code (optional)
}
```

**Response**:
```typescript
Content-Type: text/event-stream
Transfer-Encoding: chunked

data: {"type": "chunk", "content": "text..."}
data: {"type": "done", "tokens": 150}
```

**Error Responses**:
```
400 Bad Request
├─ Missing required fields
├─ Invalid module type
└─ Message exceeds length limit

422 Unprocessable Entity
├─ Input fails validation
├─ Malicious content detected
└─ Invalid UUID format

429 Too Many Requests
├─ Rate limit exceeded
├─ Retry-After: 60 (header)
└─ X-RateLimit-Remaining: 0

503 Service Unavailable
├─ OpenAI API unavailable
├─ Database connection failed
└─ Demo mode activated (with demo response)
```

### GET /api/health

**Purpose**: System health check

**Rate Limit**: 100 req/min per IP

**Response** (200 OK):
```json
{
  "status": "healthy" | "degraded" | "unavailable",
  "timestamp": "2026-07-13T10:30:00Z",
  "uptime": 86400000,
  "checks": {
    "database": "connected" | "disconnected",
    "ai": "available" | "unavailable",
    "memory": "normal" | "high"
  }
}
```

### GET /api/operations/metrics

**Purpose**: Real-time stadium operations metrics

**Rate Limit**: 50 req/min per IP

**Query Parameters**:
```
stadium?: UUID
timerange?: '1h' | '24h' | '7d' (default: '1h')
```

**Response** (200 OK):
```json
{
  "stadium": "Stadium name",
  "timestamp": "2026-07-13T10:30:00Z",
  "metrics": {
    "occupancy": 75.5,
    "incidents": 3,
    "alerts": [
      {"severity": "high", "message": "...", "time": "..."}
    ]
  }
}
```

---

## 6. Error Handling

### Error Categories

#### Operational Errors (User-facing, Safe)
```
- Invalid input (400)
- Rate limit exceeded (429)
- Resource not found (404)
- Validation failed (422)
```

#### Programming Errors (Internal, Should not occur in production)
```
- Unexpected null reference
- Type mismatch
- Logic error
- Stack overflow
```

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid stadium UUID format",
    "statusCode": 422,
    "timestamp": "2026-07-13T10:30:00Z",
    "requestId": "req_abc123..." (for debugging)
  }
}
```

### Logging Strategy

```typescript
// High Priority (Always logged)
logError("Database connection failed", error)
logError("API key missing", error)

// Medium Priority (Conditional logging)
logWarn("Rate limit approaching: 25/30 requests")
logWarn("High memory usage detected")

// Low Priority (Development only)
logInfo("Chat response generated in 1.2s")
logInfo("Cache hit for query: xyz")
```

---

## 7. CORS Configuration

### Allowed Origins

```typescript
const allowedOrigins = [
  'http://localhost:3000',      // Development
  'http://localhost:3001',      // Test
  'https://stadium-gpt.com',    // Production
  'https://www.stadium-gpt.com' // Production www
];
```

### Response Headers

```
Access-Control-Allow-Origin: https://stadium-gpt.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 3600
```

---

## 8. Data Protection

### In-Transit
```
✓ HTTPS/TLS 1.2+ required
✓ Secure WebSocket (WSS)
✓ Certificate pinning (optional)
```

### At-Rest
```
✓ Database encryption (Prisma)
✓ Sensitive data hashing
✓ Environment variable isolation
```

### Sensitive Data Handling

```typescript
// DO NOT log
- API keys
- User tokens
- Passwords
- Credit cards
- Personal health info

// DO log (with redaction)
- Request method/path
- Response status
- Error category
- User ID (not email)
- Timestamp
- Duration
```

---

## 9. Security Testing

### Unit Tests (8 test cases)

```bash
npm run test -- security.test.ts
✓ addSecurityHeaders adds all 6 security headers
✓ RateLimiter allows requests under limit
✓ RateLimiter rejects requests over limit
✓ generateSecureToken creates unique tokens
✓ hashData produces consistent hashes
✓ isValidOrigin validates trusted origins
✓ Integration scenarios
✓ Error handling
```

### Manual Testing

```bash
# Test security headers
curl -I https://stadium-gpt.com/api/health

# Test rate limiting
for i in {1..35}; do
  curl -X POST https://stadium-gpt.com/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "hi", "module": "general"}' \
    -H "X-Forwarded-For: 192.168.1.1"
done

# Expected: First 30 succeed (200), requests 31+ return 429
```

### Automated Security Scanning

```bash
# Dependency vulnerabilities
npm audit

# Code quality
npm run lint

# TypeScript strict checking
npm run type-check

# OWASP checks (manual review)
- Injection prevention
- Authentication/Session management
- XSS prevention
- CSRF protection
- Sensitive data exposure
```

---

## 10. Incident Response

### If API Key Exposed

```bash
# 1. Rotate immediately
export OPENAI_API_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 2. Check API activity
# Visit https://platform.openai.com/account/api-keys

# 3. Regenerate key
# Delete old key in OpenAI dashboard

# 4. Update production
npm run deploy

# 5. Monitor logs for unauthorized usage
```

### If Rate Limit Abuse Detected

```typescript
// 1. Identify attacker IP
const attackerIP = '192.168.1.100';

// 2. Increase rate limiting temporarily
new RateLimiter(5, 60000); // 5 req/min instead of 30

// 3. Add IP to blocklist
const blocklist = ['192.168.1.100', '192.168.1.101'];

// 4. Review logs for patterns
// Monitor: requestTime, module, status, userAgent
```

---

## 11. Security Checklist

- [x] Security headers implemented
- [x] Input validation & sanitization
- [x] Rate limiting active
- [x] Error handling without info leakage
- [x] Sensitive data not logged
- [x] CORS properly configured
- [x] API key protected in env vars
- [x] Database queries parameterized
- [ ] HTTPS/TLS enforced (production only)
- [ ] API authentication/authorization (recommended)
- [ ] Automated security scanning (CI/CD)
- [ ] Incident response playbook documented
- [ ] Security audit scheduled quarterly
- [ ] Penetration testing (annual)

---

## 12. Recommendations for Production

1. **Enable HTTPS/TLS 1.2+**
   ```
   All HTTP traffic should redirect to HTTPS
   Include HSTS header for 1 year
   Use wildcard certificate or SNI
   ```

2. **Implement API Authentication**
   ```
   Use JWT tokens or API keys
   Add scopes for fine-grained access
   Implement token rotation
   ```

3. **Add Web Application Firewall (WAF)**
   ```
   Cloud Flare WAF
   AWS WAF
   Akamai Cloud Protector
   ```

4. **Enable Logging & Monitoring**
   ```
   Structured logging (ELK stack)
   Error tracking (Sentry)
   Performance monitoring (New Relic)
   Security monitoring (automated alerts)
   ```

5. **Regular Security Audits**
   ```
   Quarterly code review
   Annual penetration testing
   Dependency scanning (Dependabot)
   OWASP compliance check
   ```

---

## References

- [OWASP Top 10](https://owasp.org/Top10/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Zod Validation](https://zod.dev/)

---

*Last Updated: 2026-07-13*
*Document Version: 1.0*
*Status: Production Ready*
