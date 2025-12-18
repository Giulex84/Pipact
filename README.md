# PiPact

PiPact is a Pi Network–compliant application that lets people publish service profiles, browse categories, and form private, bilateral work agreements. Payments in Pi are optional, manually confirmed by participants, and never escrowed. PiPact facilitates human agreements only—there are no guarantees, automated enforcement, or speculative features.

## Goals and non-goals
- Enable Pioneers to describe services and connect with each other responsibly.
- Record transparent agreement steps: `CREATED → ACCEPTED → DELIVERED → (PAID | CLOSED_UNPAID)` and `ACCEPTED → ABANDONED`.
- Provide optional Pi payment intents that users manually initiate and confirm.
- Avoid ratings, scores, or promises of income. Badges come only from objective agreement outcomes.

## Repository layout
- `packages/shared`: TypeScript models shared by backend and frontend.
- `packages/backend`: Serverless-safe helpers and in-memory state management for the API routes.
- `packages/frontend`: React + Vite starter UI that highlights categories, service profiles, lifecycle steps, and manual Pi confirmation notes.
- `TermsOfService.md` and `PrivacyPolicy.md`: clear, conservative policies.

## Pi compliance guardrails
- **No escrow and no guarantees.** PiPact never holds funds or enforces delivery.
- **Manual Pi flow.** Payment intents are initiated via Pi SDK by users; confirmation is bilateral.
- **No speculation.** The app does not offer yields, staking, trading, or financial promises.
- **Human accountability.** Agreements and badges rely only on recorded events and transparent history.
- **Neutral language.** Copy is conservative and avoids income claims.

## Getting started

### Prerequisites
- Node.js 18+
- npm 9+ (workspaces enabled)

### Install dependencies
```bash
npm install
```

### Backend (Vercel serverless)
Backend routes live under `/api` and are Vercel-native, with zero Express or custom servers. They use in-memory state only.

Key endpoints:
- `GET /api/users/me` - demo user profile (no auth yet)
- `GET /api/services` / `POST /api/services` - list and draft service profiles
- `POST /api/agreements` - create a new agreement (CREATED state)
- `GET /api/agreements/:id` - fetch agreement details and history
- `POST /api/agreements/:id/accept` - move to ACCEPTED (explicit transition)
- `POST /api/agreements/:id/mark-delivered` - move to DELIVERED (explicit transition)
- `GET /api/badges/:userId` - deterministic badges derived from agreement events

To type-check the backend helpers:
```bash
npm run --workspace @pipact/backend build
```

To exercise the serverless routes locally, use `vercel dev` (if you have Vercel CLI installed) or call the handlers with any Node HTTP client.

### Frontend
```bash
npm run --workspace @pipact/frontend dev
```
Open `http://localhost:5173` to view the starter UI. The UI demonstrates compliant copy and lifecycle visualization and is ready for Pi SDK integration.

### Shared models
```bash
npm run --workspace @pipact/shared build
```
The shared package exports TypeScript interfaces for profiles, agreements, payments, and badges, each annotated with compliance notes.

## Next steps
- Integrate Pi authentication (via Pi SDK) for identity and manual payment initiation.
- Persist data in a database with audit trails while preserving human-controlled steps.
- Build badge derivation logic using only objective agreement events.
- Add private messaging and notification hooks without automating commitments.

## License
This project is provided under the MIT license. See `LICENSE` if added later.

