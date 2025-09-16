// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://ausa-main-gagnfqbkhvgbhme2.centralindia-01.azurewebsites.net',
  USE_PROXY: true, // Set to false to make direct API calls (requires CORS to be configured on the server)
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
    ENABLE_LOGGING: true,
    PROXY_ENDPOINT: '/api/proxy',
    TEST_ENDPOINT: '/api/test',
  }
};

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isClient = typeof window !== 'undefined';