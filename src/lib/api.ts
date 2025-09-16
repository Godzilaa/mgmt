import { API_CONFIG, isClient } from './config';

const { BASE_URL, USE_PROXY, ENDPOINTS, DEV } = API_CONFIG;

export interface LoginRequest {
  identifier: string;
  role: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    identifierType: string;
    verificationId: string;
    verificationType: string;
    expiresAt: string;
    userId: string;
    role: string;
  };
}

export interface VerifyRequest {
  verificationId: string;
  token: string;
}

export interface VerifyResponse {
  success: boolean;
  message: string;
  code: number;
  data?: {
    user?: {
      userId?: string;
      email?: string;
      role?: string;
      firstname?: string;
      lastname?: string;
    };
    sessionToken?: string;
    [key: string]: unknown;
  };
}

// Registration interfaces
export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    registrationId: string;
    email: string;
    firstname: string;
    lastname: string;
  };
}

export interface EmailVerifyRequest {
  registrationId: string;
  verificationCode: string;
}

export interface EmailVerifyResponse {
  success: boolean;
  message: string;
  code: number;
  data?: {
    verificationSid?: string;
    [key: string]: unknown;
  };
}

export interface PhoneSendRequest {
  registrationId: string;
  phoneNumber: string;
}

export interface PhoneSendResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    verificationSid: string;
    phoneNumber: string;
  };
}

export interface PhoneVerifyRequest {
  registrationId: string;
  verificationSid: string;
  verificationCode: string;
}

export interface PhoneVerifyResponse {
  success: boolean;
  message: string;
  code: number;
  data?: {
    userId?: string;
    sessionToken?: string;
    [key: string]: unknown;
  };
}

// CORS-friendly fetch utility with proxy support
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  let url: string;
  let fetchOptions: RequestInit;

  if (USE_PROXY && isClient) {
    // Use Next.js API proxy for client-side requests
    url = `${DEV.PROXY_ENDPOINT}?endpoint=${encodeURIComponent(endpoint)}`;
    fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: options.body || JSON.stringify({}),
    };
  } else {
    // Direct API call (for server-side or when proxy is disabled)
    url = `${BASE_URL}${endpoint}`;
    fetchOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      ...options,
    };
  }

  try {
    if (DEV.ENABLE_LOGGING) {
      console.log('Making API call to:', url);
      console.log('With options:', fetchOptions);
    }
    
    const response = await fetch(url, fetchOptions);
    
    if (DEV.ENABLE_LOGGING) {
      console.log('Response status:', response.status);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    if (DEV.ENABLE_LOGGING) {
      console.log('API Response data:', data);
    }
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    
    // If it's a CORS error, suggest using proxy
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.warn('CORS error detected. Consider enabling the proxy by setting USE_PROXY = true');
      throw new Error('CORS Error: Unable to connect to the API server. This may be due to CORS restrictions.');
    }
    
    throw error;
  }
};

export const authAPI = {
  // Login initiate endpoint
  initiateLogin: async (loginData: LoginRequest): Promise<LoginResponse> => {
    if (USE_PROXY && isClient) {
      // When using proxy, pass the data directly
      return apiCall<LoginResponse>(ENDPOINTS.LOGIN_INITIATE, {
        body: JSON.stringify(loginData),
      });
    } else {
      // Direct API call
      return apiCall<LoginResponse>(ENDPOINTS.LOGIN_INITIATE, {
        method: 'POST',
        body: JSON.stringify(loginData),
      });
    }
  },

  // Verify login endpoint
  verifyLogin: async (verifyData: VerifyRequest): Promise<VerifyResponse> => {
    if (USE_PROXY && isClient) {
      // When using proxy, pass the data directly
      return apiCall<VerifyResponse>(ENDPOINTS.LOGIN_VERIFY, {
        body: JSON.stringify(verifyData),
      });
    } else {
      // Direct API call
      return apiCall<VerifyResponse>(ENDPOINTS.LOGIN_VERIFY, {
        method: 'POST',
        body: JSON.stringify(verifyData),
      });
    }
  },

  // Logout endpoint
  logout: async (): Promise<{ success: boolean; message: string }> => {
    if (USE_PROXY && isClient) {
      // When using proxy, pass empty data
      return apiCall<{ success: boolean; message: string }>(ENDPOINTS.LOGOUT, {
        body: JSON.stringify({}),
      });
    } else {
      // Direct API call
      return apiCall<{ success: boolean; message: string }>(ENDPOINTS.LOGOUT, {
        method: 'POST',
      });
    }
  },

  // Registration endpoints
  registerUser: async (registerData: RegisterRequest): Promise<RegisterResponse> => {
    if (USE_PROXY && isClient) {
      return apiCall<RegisterResponse>(ENDPOINTS.REGISTER_USER, {
        body: JSON.stringify(registerData),
      });
    } else {
      return apiCall<RegisterResponse>(ENDPOINTS.REGISTER_USER, {
        method: 'POST',
        body: JSON.stringify(registerData),
      });
    }
  },

  verifyEmail: async (verifyData: EmailVerifyRequest): Promise<EmailVerifyResponse> => {
    if (USE_PROXY && isClient) {
      return apiCall<EmailVerifyResponse>(ENDPOINTS.REGISTER_EMAIL_VERIFY, {
        body: JSON.stringify(verifyData),
      });
    } else {
      return apiCall<EmailVerifyResponse>(ENDPOINTS.REGISTER_EMAIL_VERIFY, {
        method: 'POST',
        body: JSON.stringify(verifyData),
      });
    }
  },

  sendPhoneVerification: async (phoneData: PhoneSendRequest): Promise<PhoneSendResponse> => {
    if (USE_PROXY && isClient) {
      return apiCall<PhoneSendResponse>(ENDPOINTS.REGISTER_PHONE_SEND, {
        body: JSON.stringify(phoneData),
      });
    } else {
      return apiCall<PhoneSendResponse>(ENDPOINTS.REGISTER_PHONE_SEND, {
        method: 'POST',
        body: JSON.stringify(phoneData),
      });
    }
  },

  verifyPhone: async (verifyData: PhoneVerifyRequest): Promise<PhoneVerifyResponse> => {
    if (USE_PROXY && isClient) {
      return apiCall<PhoneVerifyResponse>(ENDPOINTS.REGISTER_PHONE_VERIFY, {
        body: JSON.stringify(verifyData),
      });
    } else {
      return apiCall<PhoneVerifyResponse>(ENDPOINTS.REGISTER_PHONE_VERIFY, {
        method: 'POST',
        body: JSON.stringify(verifyData),
      });
    }
  },
};