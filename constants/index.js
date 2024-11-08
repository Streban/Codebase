module.exports = {
  TYPE:{
    OTP:'OTP',
    MARKETING:'MARKETING',
    BOOKING:'BOOKING',
    BOOKING_CREATED:'BOOKING_CREATED',
    BOOKING_UPDATED:'BOOKING_UPDATED',
    INVITATION:'INVITATION',
    BUSINESS:'BUSINESS',
    PAYMENT:'PAYMENT',
    USER_ACTION:'USER_ACTION',
    USER_ACTION_BASIC_PROFILE:'USER_ACTION_BASIC_PROFILE',
    USER_ACTION_NEW_DEVICE_ADDED:'USER_ACTION_NEW_DEVICE_ADDED',
    USER_ACTION_PASSWORD_CHANGED:'USER_ACTION_PASSWORD_CHANGED',
    REMINDER:'REMINDER',
    CONTACTME:'CONTACTME',
    IS_EDIT:'IS_EDIT',
    IS_CANCEL:'IS_CANCEL',
  },
  OTP_EMAIL: "otp_email",
  PROFILE_UPDATE_EMAIL: "pro_upd_email",
  KAFKA_TOPICS: {
    otp_email: "send_email_otp",
    profile_created: "profile_created",
  },
  FAILED_RETRIES: 3,
  DEFAULT_PAGE_LIMIT: 10,
  CAMPAIGN_STATUSES: {
    OK:"OK",
    SUCCESS:"SUCCESS",
    INSUFFICIENT_BALANCE:'INSUFFICIENT_BALANCE',
    FORBIDDEN:'FORBIDDEN', 
    UNKNOWN:'UNKNOWN', 
  }
};