# ONE — Human Clarity Workspace

> **Rashik — The Awakening** is the parent vision. **ONE** is the mobile workspace. **aWake** is the consent-based Cognitive Mirror that helps a person reflect, clarify, plan, and retain only the information they deliberately choose to keep.

ONE is a privacy-conscious mobile experience for turning a thought into clarity and a humane next step. It is designed as an alternative to a generic chat surface: the user remains in control of language, saved records, online consent, and workspace reset.

## Product Snapshot

| Layer | Role |
|---|---|
| **Mirror** | Captures one current thought and guides the user through Clarify, Plan, or Reflect prompts. |
| **aWake** | Provides direct online Cognitive Mirror chat only after explicit user consent. |
| **Workspace** | Holds deliberately saved reflections and humane plans on the device. |
| **Vault** | Makes storage, online-chat consent, local chat deletion, and full reset visible. |
| **Bangla-first bilingual UI** | Supports persistent বাংলা / English switching across the primary product flow. |

## Core Principles

ONE does not silently store a thought, invoke an online model, claim hidden memory, or take actions outside the user-visible workspace. The app distinguishes between its local-first tools and its optional online aWake conversation. aWake is a guide for reflection rather than an authority that replaces human judgment.

## Current Capability Boundary

The mobile workspace persists local entries and local chat history on the device. aWake chat is a server-side route and therefore requires the published backend to remain available. The user must explicitly enable online aWake use before any chat request is sent. The current personal Cloud Computer is reserved as a future aWake core gateway and policy environment; it is not a high-quality local language-model runtime.

## Documentation

| Document | Purpose |
|---|---|
| [Client Product Overview](docs/CLIENT_PRODUCT_OVERVIEW.md) | Product purpose, user outcomes, and feature walkthrough. |
| [Architecture](docs/ARCHITECTURE.md) | Mobile, backend, data-flow, and Cloud Computer boundaries. |
| [Privacy and Safety](docs/PRIVACY_AND_SAFETY.md) | Consent rules, local data, safety policy, and deletion behavior. |
| [Deployment and Operations](docs/DEPLOYMENT_AND_OPERATIONS.md) | Build, backend, environment, and Cloud Computer operating notes. |
| [Recovery Guide](docs/RECOVERY_GUIDE.md) | Backup, restore, and incident-recovery procedure. |
| [Delivery Status](docs/DELIVERY_STATUS.md) | Completed scope and approved next milestones. |

## Local Development

```bash
pnpm install
pnpm lint
pnpm dev
```

The repository intentionally excludes `.env` files, local databases, user chat history, build artifacts, runtime logs, and device-specific workspace state. Create environment configuration only through the deployment platform’s secure secret management flow.

## Project Structure

```text
app/                 Expo Router mobile screens and tabs
components/          Reusable brand, language, entry, and screen components
hooks/               Persistent local workspace state
lib/                 Localization, Cognitive Mirror domain state, tRPC client
server/              Consent-enforced aWake chat route and policy
tests/               Domain and aWake policy tests
docs/                Client-facing product and operational documentation
```

## Client Handoff

This repository is the public-safe source and documentation handoff. It does not contain secret keys, production `.env` files, user content, or restricted Cloud Computer archives. See the [Recovery Guide](docs/RECOVERY_GUIDE.md) before restoring the application in another environment.
