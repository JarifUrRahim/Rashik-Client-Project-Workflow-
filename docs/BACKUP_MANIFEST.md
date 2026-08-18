# ONE/aWake Client Backup Manifest

## Backup Scope

The delivered backup archive contains the public-safe ONE/aWake source tree, mobile assets, package manifests, tests, and all client-facing documentation present in this repository at packaging time. It is intended for restore, independent code review, client handoff, and future development continuity.

## Included Material

| Category | Included content |
|---|---|
| Application source | Expo Router screens, UI components, localization, local workspace logic, and app configuration. |
| Server source | aWake policy, consent-enforced chat route, and server integration code. |
| Quality assets | Tests, lint configuration, package lockfile, and build configuration. |
| Product documents | README, product overview, architecture, privacy, deployment, delivery status, and recovery guide. |
| Visual assets | Approved launcher, splash, favicon, and Android adaptive icon assets. |

## Intentionally Excluded Material

| Category | Reason for exclusion |
|---|---|
| `.env` and `.env.*` | May contain deployment credentials or model-provider secrets. |
| Device-local user content | Personal reflections, chat history, language preference, and Workspace data remain private to the device. |
| Databases | Local database files can contain operational or user data. |
| `node_modules`, build output, logs | Reproducible generated artifacts that do not belong in a source backup. |
| Cloud Computer archives | Restricted operational records, including the retired AgentOS archive, remain outside this public-safe handoff. |

## Verification

The accompanying handoff provides the SHA-256 checksum for the archive. Before restoring, compute the local SHA-256 for the downloaded file and compare it to the handoff value. If the values differ, do not extract the archive; obtain a clean copy instead.

## Restore Readiness

The archive can restore source and documentation, but it cannot recreate external secrets. Re-enter all server-side secrets through the deployment platform’s protected secret-management interface, then run dependency install, lint, tests, and a new project checkpoint before publishing.
