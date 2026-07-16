# GitHub Actions & Workflows (`/.github`)

This directory defines the CI/CD pipelines, issue templates, and pull request guidelines for the repository.

## Structure

- `/workflows`: Turborepo-optimized GitHub Actions (build, lint, test, preview, deploy).
- `/ISSUE_TEMPLATE`: Standardized templates for bug reports and feature requests.
- `CODEOWNERS`: Defines module ownership and mandatory review requirements.

## Rules

- **Cache Utilization**: Workflows must utilize Turborepo's remote caching to ensure minimal CI runtimes.
- **Security Checks**: All PRs must pass automated security scanning (e.g., Dependabot, CodeQL).
- **Branch Protection**: Enforce strict passing requirements before allowing merges to the main branch.
