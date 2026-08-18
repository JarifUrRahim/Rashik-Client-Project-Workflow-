# ONE and aWake — Deployment and Operations

## Mobile Application

ONE is an Expo mobile project. A new Android package should be generated from a verified project checkpoint through the deployment interface. The app is portrait-first and is designed to keep the aWake composer visible above the keyboard.

## Backend Requirement

Mirror, Workspace, Vault, language preference, and local records can operate from local state. Direct aWake chat requires the backend because the online model request must remain server-side. If the backend is unavailable or intentionally paused, local-first screens continue to work while aWake chat should show a clear unavailable or paused state.

## Cloud Computer Transition

The former AgentOS deployment was archived and retired before aWake core preparation. The old systemd service was disabled, its listener was removed, and its firewall rule was closed. The personal Cloud Computer now reserves `/home/ubuntu/awake-core/` for future aWake gateway and policy work. It is not yet a live aWake runtime.

## Operational Rules

| Rule | Requirement |
|---|---|
| Secrets | Keep secrets only in managed secret storage or protected server configuration. |
| Public services | Require authenticated HTTPS access before opening a new Cloud Computer port. |
| Persistent runtime | Use a systemd unit and document it in `AGENTS.md`. |
| Change control | Create a restore point before risky deployment, migration, or firewall changes. |
| Product truthfulness | Never display online, saved, or completed status when the corresponding action did not occur. |

## Future aWake Gateway

The recommended next server milestone is an authenticated aWake gateway with a global pause control, health endpoint, audit-safe request metadata, and explicit model-provider abstraction. This can centralize future products around one aWake policy layer without claiming that the current Cloud Computer hosts the language model itself.
