# ONE and aWake — Recovery Guide

## Backup Strategy

The project backup is a sanitized source archive plus an integrity manifest. It is designed to restore the application code, assets, package definitions, tests, and client-facing documents. It intentionally excludes production secrets, device-local user data, local databases, build output, logs, and personal Cloud Computer archives.

## Restore Procedure

1. Download the project backup archive and verify its SHA-256 against the accompanying manifest.
2. Extract it into a new working directory.
3. Install dependencies with `pnpm install`.
4. Recreate required server secrets through the platform’s secure secret management interface; do not copy secrets from a public repository.
5. Run `pnpm lint` and `pnpm test` before building or publishing.
6. Create a new checkpoint before releasing a mobile build or backend change.

## Cloud Computer Recovery

The retired AgentOS deployment is held in a restricted Cloud Computer archive. It is not included in the public repository or sanitized project backup because it contains operational history and may include protected configuration. Any future aWake server deployment should receive its own documented backup, systemd manifest, and firewall record.

## Incident Response Principle

If direct aWake chat is unavailable, preserve the local workspace. Do not delete user reflections or local chat history as a troubleshooting step. Restore or repair the server route independently, then verify consent, chat behavior, and Vault controls before resuming normal release activity.
