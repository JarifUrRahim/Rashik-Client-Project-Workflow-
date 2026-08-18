# ONE and aWake — Architecture

## System Overview

ONE is an Expo/React Native mobile application. The app follows a local-first default: reflection entries, language preference, online-chat consent, and local chat history are persisted on the device. The optional online aWake path uses a server-side tRPC route so the mobile client does not contain model-provider secrets.

```text
Mobile Device
 ├── Mirror / Workspace / Vault / aWake UI
 ├── Local workspace state and language preference
 └── Explicit consent gate
             │
             │ Only after consent
             ▼
Managed Backend
 ├── tRPC aWake chat route
 ├── Safety and language instruction
 └── Online model invocation

Future Personal Cloud Computer
 ├── aWake identity and policy gateway
 ├── User-approved memory routing
 ├── Product-to-product integration boundary
 └── No public model runtime in the current configuration
```

## Data Boundary

| Data category | Current location | Transmission rule |
|---|---|---|
| Reflection entries and plans | Device-local workspace | Not sent by the reflection flow. |
| Language preference | Device-local workspace | Not sent by itself. |
| Local chat history | Device-local workspace | Only the most recent selected context is included with a consented chat request. |
| aWake chat message | Managed server route | Sent only after the user enables online aWake use. |
| Model credentials | Server environment | Never placed in the mobile client or this public repository. |

## aWake Policy Behavior

The server-side policy requires concise, non-manipulative replies. It instructs aWake to state uncertainty clearly, avoid hidden-memory claims, avoid high-stakes diagnosis or directives, and prioritize user agency. The chat context is normalized, shortened, and limited before the model call to support responsiveness and reduce unnecessary context transfer.

## Personal Cloud Computer Boundary

The personal Cloud Computer has been prepared as the future aWake core environment. It retains no public aWake listener and currently runs no local model. Its present capacity is suitable for a secured gateway, policy layer, memory routing, and integration control plane. It is not designed to host a high-quality language model locally because it has no GPU and limited RAM.
