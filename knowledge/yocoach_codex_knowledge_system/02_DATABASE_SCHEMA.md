# Database Schema Blueprint

## Identity
users(id,email,password_hash,display_name,first_name,last_name,avatar_url,phone_country_code,phone_number,status,timezone,locale,email_verified_at,created_at,updated_at)
roles(id,code,name)
user_roles(user_id,role_id,created_at)
auth_identities(id,user_id,provider,provider_user_id,email,metadata,created_at)
sessions(id,user_id,token_hash,expires_at,created_at)

## Tutor
tutor_applications(id,user_id,status,submitted_at,reviewed_by,reviewed_at,rejection_reason,created_at,updated_at)
tutor_profiles(id,user_id,slug,headline,bio,intro_video_url,profile_image_url,country_code,city,is_public,approval_status,rating_avg,rating_count,created_at,updated_at)
tutor_documents(id,tutor_profile_id,type,file_url,verification_status,uploaded_at)
subjects(id,name,slug,parent_id)
tutor_subjects(tutor_profile_id,subject_id,level)
languages(id,code,name,is_enabled)
tutor_languages(tutor_profile_id,language_id,proficiency)
tutor_prices(id,tutor_profile_id,session_type,duration_minutes,currency_code,price_amount,is_active)

## Availability and booking
availability_rules(id,tutor_profile_id,day_of_week,start_time,end_time,timezone,is_active)
availability_exceptions(id,tutor_profile_id,date,start_time,end_time,type,reason)
bookings(id,learner_id,tutor_profile_id,booking_type,status,starts_at,ends_at,timezone,order_id,meeting_session_id,created_at,updated_at)

## Meeting
meeting_providers(id,code,name,provider_type,is_enabled)
provider_credentials(id,provider_id,environment,secret_ref,config,is_active,last_validated_at)
meeting_sessions(id,provider_id,external_session_id,status,starts_at,ends_at,metadata,created_at)

## Courses/quizzes/classes
courses(id,tutor_profile_id,category_id,slug,title,subtitle,description,language_code,level,status,price_amount,currency_code,thumbnail_url,published_at,created_at,updated_at)
course_sections(id,course_id,title,sort_order)
course_lessons(id,section_id,title,content,video_provider,video_external_id,duration_seconds,is_preview,sort_order)
enrollments(id,course_id,learner_id,order_id,status,enrolled_at)
quizzes(id,tutor_profile_id,title,description,status,time_limit_seconds,attempt_limit,shuffle_questions,created_at)
quiz_questions(id,quiz_id,question_type,prompt,points,sort_order)
group_classes(id,tutor_profile_id,title,description,subject_id,capacity,price_amount,currency_code,status,created_at)
group_class_sessions(id,group_class_id,starts_at,ends_at,meeting_session_id,status)

## Money
orders(id,buyer_id,status,currency_code,subtotal_amount,discount_amount,tax_amount,total_amount,created_at,updated_at)
order_items(id,order_id,item_type,item_id,description,quantity,unit_amount,total_amount)
payment_attempts(id,order_id,provider,status,provider_reference,amount,currency_code,metadata,created_at,updated_at)
wallet_accounts(id,user_id,currency_code,status,created_at)
wallet_ledger_entries(id,wallet_account_id,entry_type,direction,amount,currency_code,related_entity_type,related_entity_id,status,created_at)
withdrawal_requests(id,user_id,wallet_account_id,amount,currency_code,payout_method_id,status,requested_at,reviewed_by,reviewed_at)

## Config/governance
cms_pages(id,slug,title,body,status,seo_metadata_id,created_at,updated_at)
integration_configs(id,provider_code,provider_type,environment,enabled,secret_ref,config,validation_status,last_validated_at,created_at,updated_at)
audit_logs(id,actor_user_id,action,entity_type,entity_id,before,after,ip_address,user_agent,created_at)
