# Shared Types Architecture

The Shared Types architecture defines the foundational domain primitives and entity shapes used across the entire monorepo. It ensures that both the frontend and backend speak a strongly-typed, ubiquitous language.

## Domain Primitives (Value Objects)
- **IDs**: Strongly typed identifiers (e.g., UUIDv4, ULID, Snowflake) ensuring IDs from different domains cannot be accidentally mixed (e.g., `RestaurantId` vs `OrderId`).
- **Money & Currency**: Financial values represented securely (e.g., integers in cents) alongside standard ISO 4217 currency codes to prevent floating-point arithmetic errors.
- **Language & Country**: ISO 639-1 language codes and ISO 3166-1 alpha-2 country codes for internationalization and regional compliance.
- **Coordinates**: Latitude and longitude pairs for geospatial queries, deliveries, and map rendering.
- **Address**: Structured geographical addresses (Street, City, State, Zip, Country) standardized for geocoding and delivery routing.
- **Contact (Phone & Email)**: Validated E.164 phone number formats and standard email structures.
- **Date & Time**: Strict ISO 8601 strings or UTC timestamps. Avoids local timezone ambiguities at the contract level.

## Core Entities
- **Tenant**: The top-level billing and data isolation boundary (e.g., a franchise group).
- **Restaurant**: A specific physical or virtual location belonging to a Tenant, dictating operating hours, menus, and localized settings.
- **User**: The actor (Customer, Staff, or Admin) holding authentication credentials and role-based permissions.
- **Order**: The transactional record of a purchase, aggregating items, taxes, discounts, and payment status.

## Contract Utilities
- **Pagination**: Standardized structures for request queries (limit, cursor/offset) and response metadata (total count, hasNextPage, nextCursor).
