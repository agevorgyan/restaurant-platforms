# Docker Infrastructure Architecture

To support both seamless developer experiences and robust production deployments, the SaaS platform is fully containerized using Docker and Docker Compose.

## 1. Development Environment (`docker-compose.dev.yml`)

The development environment prioritizes speed, hot-reloading, and ease of use.
- **Dependencies Only & Workspace Mount**: It spins up PostgreSQL and Redis, and creates a single `dev-workspace` Node.js container. Instead of building static images, it maps the entire host codebase `.:/app` as a volume.
- **Turbo Dev**: The container runs `npm install && npx turbo run dev`, leveraging Turborepo to concurrently start all applications (`api`, `dashboard`, `customer-apps`) with hot module replacement (HMR) enabled.
- **Ports**: A range of ports (`3000-3010`) is exposed to the host machine, allowing developers to access the API on `3001`, Dashboard on `3002`, etc., seamlessly.

## 2. Production Environment (`docker-compose.yml`)

The production configuration simulates a strict, distributed deployment where every application runs in total isolation.
- **Multi-Stage Builds (`Dockerfile`)**: We utilize a highly optimized, single `Dockerfile` using multi-stage builds.
  - **Base**: Defines the Node.js 20 Alpine image.
  - **Builder**: Copies the workspace and runs `npm ci` strictly.
  - **Installer**: Builds only the specific target app requested via the `APP_NAME` build argument using `turbo run build --filter=@saas/${APP_NAME}`.
  - **Runner**: Copies only the compiled output, drops root privileges (running as user `node`), and starts the server.
- **Service Isolation**: Each app (`api`, `admin`, `dashboard`, etc.) is defined as an independent service in Docker Compose, utilizing the same `Dockerfile` but passing a different `APP_NAME` build argument.
- **Port Mapping**: The internal Next.js/NestJS applications listen on port `3000`. Docker Compose maps them to unique host ports (e.g., API -> 3001, Admin -> 3002).

## 3. Infrastructure Components

- **PostgreSQL**: Runs `postgres:15-alpine`. Data is persisted via the `pgdata` Docker volume.
- **Redis**: Runs `redis:7-alpine`. Data is persisted via the `redisdata` Docker volume. It provides caching, pub/sub for WebSockets, and queue management (BullMQ).
- **Health Checks**: 
  - Databases use native tools (`pg_isready`, `redis-cli ping`).
  - Web apps use `wget` to ping the `/health` endpoint.
  - Docker Compose `depends_on: condition: service_healthy` ensures that no backend starts before the database and cache are fully operational.

## 4. Networking

All services are isolated within a dedicated bridge network (`saas-network`).
- Internal routing uses DNS names matching the service name (e.g., the API connects to Postgres via `postgresql://postgres:password@postgres:5432/saas_db`).
- Only the specific HTTP ports required for external ingress are exposed to the host machine.
