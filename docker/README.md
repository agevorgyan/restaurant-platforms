# Docker & Container Orchestration (`/docker`)

This directory contains Dockerfiles, docker-compose configurations, and container-related scripts required for both local development and production deployments.

## Structure
- `/dev`: Docker Compose setups for local infrastructure (PostgreSQL, Redis).
- `/prod`: Base Dockerfiles and multi-stage build definitions for the applications.

## Rules
- **Multi-Stage Builds**: Production Dockerfiles must utilize multi-stage builds to minimize image size and attack surface.
- **Rootless**: Containers must not run as the root user in production.
- **Immutability**: Docker images should be treated as immutable artifacts. Configuration should be injected via environment variables at runtime.
