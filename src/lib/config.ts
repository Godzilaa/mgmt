// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ausa-main-gagnfqbkhvgbhme2.centralindia-01.azurewebsites.net',
  USE_PROXY: process.env.NEXT_PUBLIC_USE_PROXY === 'true',
  ENDPOINTS: {
    // Authentication endpoints
    LOGIN_INITIATE: '/authenticate/web/user/initiate?identifierType=email',
    LOGIN_VERIFY: '/authenticate/web/user/verify?identifierType=email',
    LOGOUT: '/authenticate/user/logout',
    
    // Registration endpoints
    REGISTER_USER: '/registrations/user',
    REGISTER_EMAIL_VERIFY: '/registrations/user/verify-email',
    REGISTER_PHONE_SEND: '/registrations/user/phone/send-verification-code',
    REGISTER_PHONE_VERIFY: '/registrations/user/phone/verify-code',
  },
  
  // Development settings
  DEV: {
    ENABLE_LOGGING: process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true',
    PROXY_ENDPOINT: '/api/proxy',
  }
};

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isClient = typeof window !== 'undefined';