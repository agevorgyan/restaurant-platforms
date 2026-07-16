# Scripts & Automation (`/scripts`)

This directory contains utility scripts for database seeding, CI/CD operations, local development bootstrapping, and environment setups.

## Rules

- **Language**: Prefer TypeScript or Node.js scripts over complex Bash scripts for better cross-platform support and maintainability.
- **Documentation**: Every script must have a `--help` flag or self-documenting header explaining its inputs, outputs, and side effects.
- **Idempotency**: Scripts used for deployment or environment setup must be idempotent (safe to run multiple times without unintended consequences).
