# Global Error Handling Architecture

A unified error handling architecture ensures consistent reporting, secure masking of internal details, and structured recovery paths across the entire platform.

## Exception Strategy & Error Hierarchy
All errors inherit from a base `AppError` class, which extends the native `Error` object but adds properties for `code`, `message`, `details`, and `isOperational`.

### Expected (Operational) Errors
- **Validation Errors**: Invalid input data (e.g., malformed email, missing fields).
- **Business Errors**: Domain rule violations (e.g., "Item out of stock", "Restaurant closed").
- **Authentication Errors**: Invalid credentials, expired tokens.
- **Authorization Errors**: Insufficient permissions, unauthorized access to resources.
- **Payment Errors**: Card declined, insufficient funds, gateway timeouts.

### Unexpected (Programmatic) Errors
- **Database Errors**: Connection drops, constraint violations.
- **Unexpected Errors**: Null pointer exceptions, memory leaks, unhandled edge cases.

## HTTP & Client Mapping

A global exception filter (middleware) catches all exceptions and maps them to standard HTTP status codes and a consistent JSON payload for clients:

| Error Type | HTTP Status | Client Payload Example |
| :--- | :--- | :--- |
| Validation | 400 Bad Request | `{ code: "VALIDATION_FAILED", details: [...] }` |
| Authentication | 401 Unauthorized | `{ code: "UNAUTHORIZED", message: "Token expired" }` |
| Payment | 402 Payment Required | `{ code: "PAYMENT_DECLINED", message: "Card declined" }` |
| Authorization | 403 Forbidden | `{ code: "FORBIDDEN", message: "Access denied" }` |
| Business | 409 Conflict / 422 | `{ code: "OUT_OF_STOCK", message: "Item unavailable" }` |
| Database/Unexpected | 500 Internal Server Error | `{ code: "INTERNAL_ERROR", message: "An unexpected error occurred" }` |

*Security Rule*: Database errors and unexpected errors MUST NEVER leak stack traces or internal implementation details to the client in production.

## Logging Strategy
- **Operational Errors**: Logged at `INFO` or `WARN` level. They are expected behaviors (e.g., user entered wrong password) and do not trigger alerts unless the threshold is unusually high (potential brute force).
- **Unexpected Errors**: Logged at `ERROR` or `FATAL` level with full stack traces, Request ID, Tenant ID, and User ID. These trigger immediate alerts to the engineering team.

## Recovery Strategy
- **Client-Side**: Global error boundaries in React catch UI crashes. API clients (e.g., Axios/Fetch interceptors) handle 401s (trigger token refresh) and 503s (trigger exponential backoff retries).
- **Server-Side**: The Node.js process gracefully handles operational errors. For unexpected errors (e.g., uncaught exceptions or unhandled promise rejections), the process logs the FATAL error and restarts itself gracefully via the process manager (e.g., PM2 or Kubernetes) to prevent corrupted state.
