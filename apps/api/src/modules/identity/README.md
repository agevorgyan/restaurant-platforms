# Identity Module

The Identity module encapsulates all authentication, authorization, user management, and organizational hierarchies for the platform.

## Architecture

This module follows **Domain-Driven Design (DDD)** and **Clean Architecture**:

- **Domain Layer**: Contains enterprise business logic. No dependencies on external libraries (NestJS, ORMs, etc.). Defines interfaces for `User`, `Session`, `Role`, `Permission`, `Organization`, and `RestaurantMembership`.
- **Application Layer**: Contains application-specific business rules. Exposes Application Services and Defines DTOs.
- **Infrastructure Layer**: Contains external interfaces like HTTP Controllers, database repositories, and framework configurations.

## Interfaces & Entities

- `IUser`: The aggregate root representing a system user.
- `ISession`: Tracks authentication sessions per device.
- `IRole` & `IPermission`: Represents RBAC metadata for authorization.
- `IOrganization`: The root tenant (e.g., A parent restaurant group).
- `IRestaurantMembership`: A join entity mapping a user to an organization with a specific role.

## Usage

This module is designed to be injected into the root `AppModule` and provides an isolated bounded context. External modules should interact with `UserService` rather than directly querying identity databases.
