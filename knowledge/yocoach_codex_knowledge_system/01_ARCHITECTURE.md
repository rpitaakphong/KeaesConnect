# Architecture

Roles: guest, learner, tutor, affiliate, admin, sub-admin.

Core modules: identity, tutor application/profile, learner dashboard, tutor availability, booking, meeting, group classes/packages, courses, protected video, quizzes, orders, payments, wallet, payouts, reviews, referrals, affiliates, CMS, SEO, blog, FAQ, forum, reporting, integration registry, admin governance.

Layered design:
- Client: public site, learner dashboard, tutor dashboard, admin dashboard.
- Application: Next.js, API client, SSR/SEO.
- Backend: FastAPI, domain services, validation, authorization, background jobs.
- Data: PostgreSQL, Redis, S3.
- Integration: OAuth, captcha, payment, payout, meeting, video, analytics, tag manager, email marketing, translation, FX.

Every external service should be configured in integration registry and used through adapter interfaces.
