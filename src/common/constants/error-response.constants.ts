import { HttpStatus } from '@nestjs/common';

export const ERROR_RESPONSE = {
  // General
  INTERNAL_SERVER_ERROR: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'internal_server_error',
    message: `Internal Server Error`,
  },
  UNAUTHORIZED: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'unauthorized',
    message: 'Authentication required',
  },
  BAD_REQUEST: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'bad_request',
    message: `Bad Request`,
  },
  INVALID_CREDENTIALS: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'invalid_credentials',
    message: 'Incorrect email or password. Please check your credentials and try again',
  },
  INVALID_EMAIL: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'invalid_email',
    message: 'Invalid email',
    errorField: 'email',
  },
  INVALID_PASSWORD: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'invalid_password',
    message: 'The current password is incorrect',
    errorField: 'currentPassword',
  },
  RESOURCE_FORBIDDEN: {
    statusCode: HttpStatus.FORBIDDEN,
    errorCode: 'resource_forbidden',
    message: 'Access denied',
  },
  RESOURCE_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'resource_not_found',
    message: 'Resource not found',
  },
  RESOURCE_ALREADY_EXISTED: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'resource_already_existed',
    message: 'Resource already existed',
  },
  UNPROCESSABLE_ENTITY: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'unprocessable_entity',
    message: `Unprocessable entity`,
  },
  REQUEST_PAYLOAD_VALIDATION_ERROR: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'request_payload_validation_error',
    message: 'Invalid request payload data',
  },
  INVALID_FILES: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'invalid_files',
    message: `Invalid files`,
  },
  // Authentication
  USER_ALREADY_EXISTS: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'user_already_exists',
    message: 'Unable to create account with provided credentials',
  },
  EMAIL_NOT_VERIFIED: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'email_not_verified',
    message: 'Email not verified',
  },
  USER_DEACTIVATED: {
    statusCode: HttpStatus.FORBIDDEN,
    errorCode: 'user_deactivated',
    message: 'Account access denied',
  },
  INVALID_TOKEN_USAGE: {
    statusCode: HttpStatus.FORBIDDEN,
    errorCode: 'invalid_token_usage',
    message: 'Invalid token type',
  },
  INVALID_GOOGLE_TOKEN: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'invalid_google_token',
    message: 'Invalid Google token',
  },
  EMAIL_ALREADY_VERIFIED: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'email_already_verified',
    message: 'Email already verified',
  },
  LINK_EXPIRED: {
    statusCode: HttpStatus.GONE,
    errorCode: 'verification_link_expired',
    message: 'Verification link has expired',
  },
  INVALID_VERIFICATION_CODE: {
    statusCode: HttpStatus.GONE,
    errorCode: 'invalid_verification_code',
    message: 'Verification code is invalid',
  },
  VERIFICATION_CODE_EXPIRED: {
    statusCode: HttpStatus.GONE,
    errorCode: 'verification_code_expired',
    message: 'Verification code has expired',
  },
  PENDING_BILLING_CONSTRAINT: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'pending_billing_constraint',
    message:
      'Cannot delete practitioner profile - has pending billing that needs to be resolved first',
  },
  SELF_PRACTITIONER_DELETE_NOT_ALLOWED: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'self_practitioner_delete_not_allowed',
    message:
      'Self-practitioners are not allowed to delete their profile. Please deactivate instead.',
  },
  USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'user_not_found',
    message: 'User not found',
  },
  PASSWORD_NOT_CHANGED: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'password_not_changed',
    message: 'New password cannot be the same as the old password',
    errorField: 'newPassword',
  },
  TWO_FACTOR_NOT_ENABLED: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'two_factor_not_enabled',
    message: 'Two-factor authentication is not enabled for this user',
  },
  PAYMENT_ERROR: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'payment_error',
    message: 'Something happen during payment process',
  },
  // Appointment
  NO_AVAILABILITY: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'no_availability',
    message: 'No availability for the selected date',
  },
  INVALID_OBJECT: (objectName: string) => {
    const errorCodeFormat = objectName.replace(' ', '_').toLowerCase();
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: `invalid_${errorCodeFormat}`,
      message: `Invalid ${objectName}`,
    };
  },
  // Referral
  REFERRAL_LINK_GENERATION_ERROR: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'referral_link_generation_error',
    message: 'Unable to generate referral link. Please try again.',
  },
  DUPLICATE_PAYMENT_METHOD: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'duplicate_payment_method',
    message: 'Payment method already exists',
  },
  // Calendar Oauth
  INVALID_OAUTH_STATE: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'invalid_oauth_state',
    message: 'Invalid oauth state',
  },
  CALENDAR_OAUTH_ERROR: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'calendar_oauth_error',
    message: 'Error during calendar OAuth process',
  },
  CALENDAR_ALREADY_CONNECTED: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'calendar_already_connected',
    message: 'Calendar is already connected',
  },
  CALENDAR_NOT_CONNECTED: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'calendar_not_connected',
    message: 'Calendar is not connected',
  },
  CALENDAR_SYNC_ERROR: {
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    errorCode: 'calendar_sync_error',
    message: 'Failed to sync with the calendar provider.',
  },
  WEBHOOK_SETUP_FAILED: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'webhook_setup_failed',
    message: 'Failed to setup calendar webhook',
  },
  WEBHOOK_INVALID_HEADERS: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'webhook_invalid_headers',
    message: 'Invalid or missing webhook headers',
  },
  WEBHOOK_CHANNEL_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'webhook_channel_not_found',
    message: 'Webhook channel not found in database',
  },
  WEBHOOK_CHANNEL_EXPIRED: {
    statusCode: HttpStatus.GONE,
    errorCode: 'webhook_channel_expired',
    message: 'Webhook channel has expired',
  },
  WEBHOOK_PROCESSING_FAILED: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'webhook_processing_failed',
    message: 'Failed to process webhook notification',
  },
  // Security
  GOOGLE_EMAIL_MISMATCH: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'google_email_mismatch',
    message: "Google email doesn't match user's email",
  },
  // System Feedback
  SYSTEM_FEEDBACK_NOT_ELIGIBLE: {
    statusCode: HttpStatus.FORBIDDEN,
    errorCode: 'system_feedback_not_eligible',
    message: 'Feedback is not eligible for generation at this time',
  },
  HAS_SCHEDULED_APPOINTMENTS: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'has_scheduled_appointments',
    message:
      'You have scheduled appointments. Please complete or cancel them before deleting your account.',
  },
  HAS_UNPAID_BILLING: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'has_unpaid_billing',
    message: 'You have unpaid bills. Please settle them before deleting your account.',
  },
  OBJECT_NOT_FOUND: (objectName: string) => {
    const errorCodeFormat = objectName.replace(' ', '_').toLowerCase();
    return {
      statusCode: HttpStatus.NOT_FOUND,
      errorCode: `${errorCodeFormat}_not_found`,
      message: `${objectName} not found.`,
    };
  },
  OVERLAPPING_SCHEDULE: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'overlapping_schedule',
    message: 'The requested schedule conflicts with an existing schedule.',
  },
  OUT_OF_WORKING_BOOKING_EXISTS: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'out_of_working_booking_exists',
    message:
      'This time range includes existing appointments. Please cancel or reschedule them before marking it as Out of Working',
  },
  REQUIRED: (objectName: string) => {
    const errorCodeFormat = objectName.replace(' ', '_').toLowerCase();
    return {
      statusCode: HttpStatus.NOT_FOUND,
      errorCode: `${errorCodeFormat}_must_be_required`,
      message: `${objectName} must be required.`,
    };
  },
  MAXIMUM_EMAIL_RESEND: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    errorCode: 'maximum_email_resend',
    message: 'Maximum email resend',
  },
  MERCHANT_ALREADY_EXISTS: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'merchant_already_exists',
    message: 'Merchant name already exists',
  },
  MERCHANT_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'merchant_not_found',
    message: 'Merchant not found',
  },
};
