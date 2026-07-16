# Restaurant Module

The Restaurant module encapsulates all logic related to physical restaurant entities, branch locations, working hours, and specific operational settings.

## Architecture

This module follows **Domain-Driven Design (DDD)** and **Clean Architecture**:

- **Domain Layer**: Contains enterprise business logic. No dependencies on external libraries (NestJS, ORMs, etc.). Defines interfaces for `Restaurant`, `Branch`, `WorkingHours`, `RestaurantSettings`, `ThemeSettings`, and `RestaurantMember`. Also contains custom Value Objects like `TimeRange` and `Address`.
- **Application Layer**: Contains application-specific business rules. Exposes Application Services (`RestaurantService`) and DTOs.
- **Infrastructure Layer**: Contains external interfaces like HTTP Controllers (`RestaurantController`) and database repositories (`InMemoryRestaurantRepository`).

## Interfaces & Entities

- `IRestaurant`: The aggregate root representing a Restaurant entity (linked to an Organization in the Identity module).
- `IBranch`: Represents a physical branch location with an `Address` Value Object.
- `IWorkingHours`: Represents operational hours for a branch, utilizing `TimeRange` Value Objects.
- `IRestaurantSettings` & `IThemeSettings`: Configuration entities dictating operational and UI logic for a specific restaurant.
- `IRestaurantMember`: Connects a User (Identity) to a specific Restaurant entity with an operational role (e.g. `chef`, `staff`).

## Usage

This module is designed to be injected into the root `AppModule` and provides an isolated bounded context. It integrates loosely with the Identity module via standard Foreign Keys (e.g., `organizationId`, `userId`) but maintains no hard codebase coupling.
