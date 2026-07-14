# Enterprise Logging Architecture

The logging architecture is designed for high observability, auditing, and debugging across a distributed, multi-tenant environment. It relies exclusively on structured JSON logging to enable automated parsing, alerting, and analysis by aggregation platforms.

## Structured Logging & Context
All logs are emitted as structured JSON. Every log entry must include a baseline contextual payload to trace execution flow and tenant activity:
- **Trace ID**: Unique identifier spanning the entire distributed transaction across multiple services.
- **Request ID**: Identifier for a specific HTTP request or background job execution within a single service.
- **Correlation ID**: Business-level identifier linking related operations (e.g., Order ID tying together payment and fulfillment logs).
- **Tenant ID**: The Restaurant ID, essential for isolating logs in a multi-tenant SaaS.
- **User ID**: The identity of the actor performing the action (Admin, Customer, System).

## Log Levels & Categorization
Standard error levels dictate the severity and alerting rules:
- `FATAL`: System-level failures requiring immediate pager alerts.
- `ERROR`: Unhandled exceptions or transaction failures.
- `WARN`: Expected anomalies, retries, or deprecations.
- `INFO`: Normal business operations and lifecycle events.
- `DEBUG` / `TRACE`: Detailed diagnostic information (disabled in production).

## Specialized Log Types
Beyond standard application logs, the system emits specialized streams for compliance and analysis:
- **Performance Logs**: Tracks execution time, query durations, and latency metrics. Used to generate APM traces and bottleneck alerts.
- **Audit Logs**: Immutable records of critical business events (e.g., "Menu Updated", "Price Changed"). Captures "Who, What, When, and Previous State". Retained for compliance.
- **Security Logs**: Tracks authentication attempts (success/failure), authorization denials, API key usage, and rate-limiting events. Forwarded to SIEM for anomaly detection.

## Ingestion & Pipeline
1. **Application Layer**: Emits JSON logs to `stdout` without writing to local files.
2. **Infrastructure Layer**: Container orchestrator (Docker/K8s) or cloud provider captures `stdout`.
3. **Log Shipper**: Agents (e.g., FluentBit, Vector) forward logs to the aggregator.
4. **Aggregation & Storage**: Centralized platform indexes the JSON fields, enabling complex queries (e.g., "Show ERRORs for Tenant X where Latency > 500ms").
