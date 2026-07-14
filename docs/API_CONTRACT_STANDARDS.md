# API Contract Standards

The API Contract Standards define the rules for designing, documenting, and implementing RESTful APIs across the platform. Strict adherence ensures consistency for front-end clients, mobile apps, and third-party integrations.

## REST & OpenAPI
- **RESTful Principles**: Resources are modeled as nouns (e.g., `/orders`, `/restaurants`). Use standard HTTP methods: `GET` (read), `POST` (create), `PUT` (replace), `PATCH` (update), `DELETE` (remove).
- **OpenAPI Specification**: All APIs must be documented using OpenAPI 3.0+. The spec acts as the single source of truth, from which client SDKs and TypeScript types are automatically generated.

## DTOs & Validation
- **Data Transfer Objects (DTOs)**: Used to define the exact shape of request payloads and response bodies, separating API contracts from internal database schemas.
- **Validation**: All incoming requests (body, query, params) must be strictly validated against DTOs using Zod or `class-validator`. Invalid requests fast-fail with a 400 Bad Request error.

## Collection Endpoints (Listings)
- **Pagination**: Use cursor-based pagination for high-frequency data (e.g., activity logs) and offset/limit pagination for dashboard tables. Query parameters: `?limit=20&page=2` or `?limit=20&cursor=xyz`.
- **Filtering**: Use query parameters for exact matches (`?status=COMPLETED`) or bracket notation for operators (`?price[gte]=10`).
- **Sorting**: Use the `sort` parameter. Prefix with `-` for descending order (`?sort=-createdAt,total`).
- **Searching**: Use the `q` parameter for full-text or broad searches (`?q=burger`).

## Response Formats

### Success Format
All successful responses must follow a consistent, wrapped JSON structure:
```json
{
  "success": true,
  "data": { ... },
  "meta": { ... } // Optional: pagination, rate limits, etc.
}
```

### Error Format
Errors must follow a standard structure, never leaking stack traces to clients:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid input provided.",
    "details": [
      { "field": "email", "issue": "Must be a valid email address." }
    ]
  },
  "meta": {
    "requestId": "req_12345" // For tracing in logs
  }
}
```

## Versioning
- **URL Versioning**: Major versions are included in the URL path (e.g., `/api/v1/orders`).
- **Backwards Compatibility**: Minor additions (new fields, new endpoints) must not break existing clients. Breaking changes (removing fields, changing types) require a new major version (`v2`).
