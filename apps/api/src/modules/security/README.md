# Enterprise Security Platform (Authentication)

This module encapsulates all authentication flows for the enterprise platform. It strictly handles **Authentication** and does not handle Authorization (which is managed by a separate identity module).

## Features
- JWT Access Tokens and Refresh Tokens
- Passkeys (WebAuthn)
- Multi-factor Authentication (MFA)
- OAuth2, OpenID Connect, SAML
- Session Management & Revocation
- Password Policies

## Architecture
- **Domain-Driven Design (DDD)**
- **Clean Architecture**
- **CQRS** for complex read models

## Setup
Import `SecurityModule` in your `AppModule`.
