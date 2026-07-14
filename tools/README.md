# Internal Tools (`/tools`)

This directory houses bespoke internal tools, CLIs, and generators used to accelerate developer workflow and maintain consistency.

## Purpose
- Scaffolding new applications or packages with correct boilerplate.
- Custom code-mods for large scale refactoring.
- Developer experience (DX) enhancements and telemetry.

## Rules
- **Usability**: Treat internal tools like products. They should be intuitive and well-documented.
- **No Production Code**: Code in this directory must never be shipped to production or included in client bundles.
