# Master Context

Build a full custom premium Yo!Coach-inspired eLearning marketplace. It is marketplace + booking + live lessons + courses + quizzes + wallet + payout + admin CMS + SEO + analytics + affiliate/referral + multilingual/multi-currency system.

Initial market: Thailand. Future market: global. Quality target: high-end, premium, flawless.

Recommended stack: Next.js + TypeScript frontend, FastAPI backend, PostgreSQL, Redis, S3-compatible storage, VdoCipher for protected video initially, Jitsi or LessonSpace for live sessions initially, Stripe plus planned Thailand-local payment adapter.

Non-negotiables:
- Separate order/payment/wallet/payout layers.
- Store booking times in UTC and render in user timezone.
- Use provider adapters for integrations.
- Admin controls integrations, CMS, SEO, payments, meeting tools, currencies, languages, feature flags.
- Tutors require approval before public teaching.
- Use audit logs for admin and financial actions.
- Build a modular monolith first.
