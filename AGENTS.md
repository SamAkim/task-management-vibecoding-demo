# Task Management VibeCoding Demo — Agent Instructions

## Repository Boundary

For all GitHub repository operations, use the connected official GitHub MCP
Server.

The only repository permitted for write operations is:

SamAkim/task-management-vibecoding-demo

Do not create branches, commits, pull requests, issues, releases, or file
updates in any other GitHub repository.

## Prohibited Repository Commands

Do not execute git commands, GitHub CLI commands, shell scripts, PowerShell
commands, or terminal-based repository commands for GitHub operations.

Never push directly to main.

## Development Workflow

For every requested feature:

1. Inspect the local application files.
2. Create or update application code.
3. Generate or update unit tests.
4. Run the project's lint, test, coverage, and build scripts locally.
5. Diagnose and fix ordinary coding failures automatically.
6. Do not publish changes until local validation succeeds.
7. Use GitHub MCP tools to create a descriptive feature branch from main.
8. Use GitHub MCP tools to upload changed files and create a commit.
9. Use GitHub MCP tools to open a pull request targeting main.
10. Monitor GitHub Actions through MCP.
11. Never bypass branch rules, required checks, or the SonarQube Quality Gate.
12. Report the pull-request URL, CI status, merge status, and deployment status.

## Allowed Local Commands

Local application setup and validation commands are allowed when required,
including:

- npm install
- npm run lint
- npm run test
- npm run test:coverage
- npm run build

These commands may be used only for application development and validation,
not for GitHub repository operations.
