# API Contracts

Base path: /api/v1

Auth: POST /auth/register, POST /auth/login, POST /auth/logout, POST /auth/forgot-password, POST /auth/reset-password, GET /auth/oauth/google/start, GET /auth/oauth/google/callback, GET /auth/oauth/apple/start, GET /auth/oauth/apple/callback.

Tutor application: POST /tutor-applications, GET /tutor-applications/me, PATCH /tutor-applications/me, POST /tutor-applications/me/submit, GET /admin/tutor-applications, POST /admin/tutor-applications/{id}/approve, POST /admin/tutor-applications/{id}/reject.

Tutor profile: GET /tutors, GET /tutors/{slug}, GET /tutor/profile, PATCH /tutor/profile, POST /tutor/profile/media, PUT /tutor/profile/prices, PUT /tutor/profile/subjects, PUT /tutor/profile/languages.

Availability/booking: GET /tutor/availability, PUT /tutor/availability, POST /tutor/availability/exceptions, GET /tutors/{id}/slots, POST /bookings/quote, POST /bookings, GET /bookings/me, POST /bookings/{id}/cancel, POST /bookings/{id}/reschedule.

Payments: POST /checkout/session, POST /payments/webhooks/{provider}, GET /orders/me, GET /admin/orders, POST /admin/orders/{id}/refund.

Courses: POST /tutor/courses, GET /tutor/courses, PATCH /tutor/courses/{id}, POST /tutor/courses/{id}/submit, GET /courses, GET /courses/{slug}, POST /courses/{id}/purchase, GET /courses/{id}/content, POST /courses/{id}/progress.

Group classes: POST /tutor/group-classes, GET /tutor/group-classes, PATCH /tutor/group-classes/{id}, GET /group-classes, GET /group-classes/{slug}, POST /group-classes/{id}/enroll.

Quizzes: POST /tutor/quizzes, GET /tutor/quizzes, PATCH /tutor/quizzes/{id}, POST /quizzes/{id}/attempts, POST /quiz-attempts/{id}/answers, POST /quiz-attempts/{id}/submit, GET /quiz-attempts/{id}/result.

Wallet/payout: GET /wallet, GET /wallet/entries, POST /withdrawals, GET /withdrawals/me, GET /admin/withdrawals, POST /admin/withdrawals/{id}/approve, POST /admin/withdrawals/{id}/reject.

CMS/SEO: GET /pages/{slug}, GET /faqs, GET /blog, GET /blog/{slug}, admin CRUD for pages, blocks, menus, FAQs, blog, SEO metadata, redirects, scripts.

Integrations: GET /admin/integrations, POST /admin/integrations/{provider_code}/validate, PATCH /admin/integrations/{id}, POST /admin/integrations/{id}/enable, POST /admin/integrations/{id}/disable.
