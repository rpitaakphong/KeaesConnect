# Workflow States

Tutor application: draft -> submitted -> under_review -> approved or rejected. Approved can become suspended.

Course: draft -> pending_review -> published or rejected. Published can become archived.

Booking: draft -> pending_payment -> confirmed -> in_progress -> completed. Pending can expire. Confirmed can be cancelled. Completed can be disputed.

Payment attempt: created -> pending -> succeeded, failed, or cancelled.

Order: pending -> paid -> fulfilled, partially_refunded, or refunded. Pending can fail or expire.

Wallet entry: pending -> settled or failed. Settled can be reversed.

Withdrawal request: requested -> under_review -> approved -> processing -> completed. Can be rejected or failed.

Group class: draft -> scheduled -> live -> completed. Can be cancelled.

Quiz attempt: not_started -> in_progress -> submitted -> graded. Can expire.

Reported issue: reported -> under_review -> escalated -> resolved or dismissed.
