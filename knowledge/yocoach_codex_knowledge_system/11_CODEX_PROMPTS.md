# Codex Prompts

## Prompt 1 — Initial Repository Understanding
Read every Markdown file in `/knowledge/yocoach_codex_knowledge_system/`. Summarize the platform vision, core modules, tech stack, domain boundaries, workflows, and highest-risk implementation areas. Do not write code yet.

## Prompt 2 — Project Scaffold
Create a production-ready monorepo scaffold using Next.js, FastAPI, PostgreSQL, Redis, Docker Compose, Alembic migrations, and shared documentation. Create clean folder boundaries for identity, tutor, booking, meeting, course, quiz, payments, wallet, cms, admin, integrations.

## Prompt 3 — Database Schema First Pass
Using `02_DATABASE_SCHEMA.md`, create SQLAlchemy models and Alembic migrations for the core tables. Include indexes and foreign keys.

## Prompt 4 — Auth and RBAC
Implement auth and RBAC based on domain model, API contracts, and admin permission matrix. Include registration, login, password hashing, JWT/session token, role assignment, permission checking, admin-only route example, and audit logs.

## Prompt 5 — Tutor Application Flow
Implement create/update/submit tutor application and admin approve/reject. Use states from workflow states. Add audit logs.

## Prompt 6 — Booking Engine
Implement availability rules, exceptions, slot generation, pending booking, booking confirmation after payment placeholder. Store all times in UTC. Write timezone/overlap tests.

## Prompt 7 — Wallet Ledger
Implement append-only wallet ledger with payment/order/wallet/payout separation. Support credit, debit, pending, settled, reversed, withdrawal hold, and failure reversal.

## Prompt 8 — Integration Registry
Implement integration registry and provider interfaces for PaymentInAdapter, PayoutAdapter, MeetingAdapter, and VideoHostingAdapter.

## Prompt 9 — Frontend Route Shell
Create frontend route shells from `04_FRONTEND_ROUTES.md` with PublicLayout, DashboardLayout, TutorLayout, and AdminLayout.

## Prompt 10 — Build Review
Review the codebase against every file in the knowledge system and create a gap report: implemented, partially implemented, missing, risky, recommended next actions.
