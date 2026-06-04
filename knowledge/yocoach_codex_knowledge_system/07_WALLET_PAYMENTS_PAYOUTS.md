# Wallet, Payments, Payouts

Never merge external payment collection, internal wallet ledger, and external payout settlement.

Payment flow: learner creates order, payment attempt created, gateway checkout starts, webhook returns status, transaction recorded, order paid, purchased item activated.

Tutor earnings flow: gross revenue recorded, commission calculated, tutor net earning credited to wallet, admin revenue recorded, settlement record created.

Ledger entries are append-only. Use reversal entries for corrections.

Entry types: learner_topup, booking_purchase, course_purchase, class_purchase, refund_credit, tutor_earning, platform_commission, withdrawal_hold, withdrawal_completed, withdrawal_failed_reversal, admin_adjustment, referral_reward, affiliate_commission.

Withdrawal flow: tutor requests withdrawal, amount is held, admin reviews, approved payout created, payout completes, hold becomes final debit. If payout fails, hold reverses.
