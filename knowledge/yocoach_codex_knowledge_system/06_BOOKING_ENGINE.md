# Booking Engine Rules

Store booking times in UTC. Store user timezone separately. Display times in local timezone.

Tutor availability comes from weekly rules, exceptions, external calendar busy blocks, existing confirmed bookings, booking cutoffs, tutor status, and platform limits.

Slot generation inputs: tutor_profile_id, date_from, date_to, learner_timezone, duration_minutes, session_type, current time, booking cutoff rules, tutor active status, tutor price rules.

Exclude slot when tutor is not approved/public, outside availability, blocked by exception, overlaps booking, overlaps Google Calendar busy event, inside cutoff window, tutor suspended, platform maintenance, or session type unavailable.

Booking flow: select slot, backend revalidates, create quote/pending booking, create order, learner pays, webhook confirms order, booking confirmed, meeting session created, notifications sent.

Pending bookings expire after 10–15 minutes. Tutor wallet credit happens only after completion rules are satisfied.
