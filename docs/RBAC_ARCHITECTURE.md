# Enterprise RBAC Architecture

The Role-Based Access Control (RBAC) architecture provides a secure, flexible, and granular permission system for managing access across the platform. It is designed to scale from simple user roles to complex organizational hierarchies while laying the groundwork for future Attribute-Based Access Control (ABAC).

## Core Concepts

- **Permissions**: The most granular level of access right (e.g., `orders:read`, `menu:write`). Permissions are immutable strings representing specific actions on specific resources.
- **Roles**: A named collection of permissions (e.g., `Manager`, `Cashier`, `Admin`). Roles are assigned to users to grant them the associated permissions.
- **Scopes**: Defines the boundary within which a role is active. A user might be a `Manager` at "Location A" (Restaurant Scope) but only a `Viewer` at the "Franchise Level" (Tenant Scope).
- **Policies**: Higher-level rules that aggregate Roles and Scopes. A policy binds a User to a Role within a specific Scope (e.g., "User X has Role Y in Scope Z").

## Inheritance & Hierarchy

- **Role Inheritance**: Roles can inherit permissions from other roles. For example, a `Restaurant Manager` role inherits all permissions of the `Staff` role, plus administrative privileges. This reduces duplication and simplifies permission updates.
- **Scope Inheritance**: Permissions granted at a higher scope (e.g., Tenant/Franchise) cascade down to child scopes (e.g., individual Restaurants), unless explicitly overridden or denied.

## Future ABAC Support (Attribute-Based Access Control)

While the system is strictly RBAC today, the architecture is designed to accommodate ABAC in the future. 
- The policy evaluation engine accepts a "Context" object (containing user attributes, resource attributes, and environment conditions like IP address or time of day).
- Currently, the engine only evaluates Role and Scope. In the future, policies can be expanded to include conditional rules (e.g., "Allow `refund:create` ONLY IF `order.amount < $50` AND `time` is during business hours").
