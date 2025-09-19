// API Configuration
export const config = {
  // API Configuration
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ausa-main-gagnfqbkhvgbhme2.centralindia-01.azurewebsites.net',
  useProxy: process.env.NEXT_PUBLIC_USE_PROXY === 'true',
  enableLogging: process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true',
  
  // CAPTCHA Configuration
  captcha: {
    provider: (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? 'recaptcha' : 
               process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ? 'hcaptcha' : 
               'none') as 'recaptcha' | 'hcaptcha' | 'none',
    recaptcha: {
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      secretKey: process.env.RECAPTCHA_SECRET_KEY,
    },
    hcaptcha: {
      siteKey: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
      secretKey: process.env.HCAPTCHA_SECRET_KEY,
    },
  },
};

// Legacy export for backward compatibility
export const API_CONFIG = {
  BASE_URL: config.baseURL,
  USE_PROXY: config.useProxy,
  ENDPOINTS: {
    LOGIN: '/authenticate/web/user/initiate?identifierType=email',
    LOGIN_INITIATE: '/authenticate/web/user/initiate?identifierType=email',
    VERIFY: '/authenticate/web/user/verify?identifierType=email',
    LOGIN_VERIFY: '/authenticate/web/user/verify?identifierType=email', 
    LOGOUT: '/authenticate/user/logout',
    USER_ME: '/authenticate/user/me',
    REGISTER: '/users/register',
    REGISTER_USER: '/users/register',
    VERIFY_EMAIL: '/users/verify-email',
    REGISTER_EMAIL_VERIFY: '/users/verify-email',
    SEND_PHONE_VERIFICATION: '/users/send-phone-verification',
    REGISTER_PHONE_SEND: '/users/send-phone-verification', 
    VERIFY_PHONE: '/users/verify-phone',
    REGISTER_PHONE_VERIFY: '/users/verify-phone'
  },
  DEV: process.env.NODE_ENV === 'development',
  PROXY_ENDPOINT: '/api/proxy',
  ENABLE_LOGGING: config.enableLogging
};

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isClient = typeof window !== 'undefined';