# Integration Registry

Each integration config has provider_code, provider_type, display_name, environment, enabled, secret_ref, config_json, validation_status, last_validated_at, created_by, updated_by, created_at, updated_at.

Provider types: auth, captcha, payment_in, payout, meeting, video_hosting, calendar, analytics, tag_manager, email_marketing, translation, currency_conversion.

Provider codes: google_login, apple_login, google_recaptcha, stripe, paypal_standard, authorize_net, paystack, bank_transfer, thai_payment_gateway_future, paypal_payout, bank_payout, jitsi, lessonspace, atomchat, zoom_future, vdocipher, mux_future, google_calendar, google_analytics, google_tag_manager, mailchimp, microsoft_translator, fixer.

Adapter interfaces:
- PaymentInAdapter: create_checkout_session, verify_webhook, refund, get_payment_status.
- PayoutAdapter: create_payout, get_payout_status, handle_failure.
- MeetingAdapter: create_meeting, update_meeting, cancel_meeting, get_join_links, fetch_recordings.
- VideoHostingAdapter: create_upload_url, get_playback_token, handle_callback.
- OAuthAdapter: get_authorization_url, exchange_code, get_user_info.

Do not store raw secrets in normal DB columns. Store secret_ref and non-sensitive config only.
