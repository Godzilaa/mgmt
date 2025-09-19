import { API_CONFIG, isClient } from './config';

const { BASE_URL, USE_PROXY, ENDPOINTS } = API_CONFIG;

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
    url = `${API_CONFIG.PROXY_ENDPOINT}?endpoint=${encodeURIComponent(endpoint)}`;
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
    if (API_CONFIG.ENABLE_LOGGING) {
      console.log('Making API call to:', url);
      console.log('With options:', fetchOptions);
    }
    
    const response = await fetch(url, fetchOptions);
    
    if (API_CONFIG.ENABLE_LOGGING) {
      console.log('Response status:', response.status);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    if (API_CONFIG.ENABLE_LOGGING) {
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
      return apiCall<LoginResponse>(ENDPOINTS.LOGIN, {
        body: JSON.stringify(loginData),
      });
    } else {
      // Direct API call
      return apiCall<LoginResponse>(ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(loginData),
      });
    }
  },

  // Verify login endpoint
  verifyLogin: async (verifyData: VerifyRequest): Promise<VerifyResponse> => {
    if (USE_PROXY && isClient) {
      // When using proxy, pass the data directly
      return apiCall<VerifyResponse>(ENDPOINTS.VERIFY, {
        body: JSON.stringify(verifyData),
      });
    } else {
      // Direct API call
      return apiCall<VerifyResponse>(ENDPOINTS.VERIFY, {
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
      return apiCall<RegisterResponse>(ENDPOINTS.REGISTER, {
        body: JSON.stringify(registerData),
      });
    } else {
      return apiCall<RegisterResponse>(ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(registerData),
      });
    }
  },

  verifyEmail: async (verifyData: EmailVerifyRequest): Promise<EmailVerifyResponse> => {
    if (USE_PROXY && isClient) {
      return apiCall<EmailVerifyResponse>(ENDPOINTS.VERIFY_EMAIL, {
        body: JSON.stringify(verifyData),
      });
    } else {
      return apiCall<EmailVerifyResponse>(ENDPOINTS.VERIFY_EMAIL, {
        method: 'POST',
        body: JSON.stringify(verifyData),
      });
    }
  },

  sendPhoneVerification: async (phoneData: PhoneSendRequest): Promise<PhoneSendResponse> => {
    if (USE_PROXY && isClient) {
      return apiCall<PhoneSendResponse>(ENDPOINTS.SEND_PHONE_VERIFICATION, {
        body: JSON.stringify(phoneData),
      });
    } else {
      return apiCall<PhoneSendResponse>(ENDPOINTS.SEND_PHONE_VERIFICATION, {
        method: 'POST',
        body: JSON.stringify(phoneData),
      });
    }
  },

  verifyPhone: async (verifyData: PhoneVerifyRequest): Promise<PhoneVerifyResponse> => {
    if (USE_PROXY && isClient) {
      return apiCall<PhoneVerifyResponse>(ENDPOINTS.VERIFY_PHONE, {
        body: JSON.stringify(verifyData),
      });
    } else {
      return apiCall<PhoneVerifyResponse>(ENDPOINTS.VERIFY_PHONE, {
        method: 'POST',
        body: JSON.stringify(verifyData),
      });
    }
  },
};

// Care Provider API Functions
export interface AssignedPatientsResponse {
  success: boolean;
  patients: Array<{
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    assignedAt: string;
  }>;
}

export interface PatientRecordsResponse {
  success: boolean;
  records: Array<{
    _id: string;
    recordType: string;
    data: any;
    createdAt: string;
    updatedAt: string;
  }>;
}

export async function getAssignedPatients(): Promise<AssignedPatientsResponse> {
  // Try different possible endpoint paths
  const possibleEndpoints = [
    '/care-provider/patients/assigned',
    '/careprovider/patients/assigned',
    '/api/care-provider/patients/assigned',
    '/providers/patients/assigned',
    '/assignments/patients',
  ];
  
  let lastError: Error | null = null;
  
  for (const endpoint of possibleEndpoints) {
    try {
      console.log(`Trying endpoint: ${endpoint}`);
      
      // Get session token if available
      const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('sessionToken') : null;
      
      if (USE_PROXY && isClient) {
        const result = await apiCall<AssignedPatientsResponse>(endpoint, {
          body: JSON.stringify({ 
            method: 'GET',
            sessionToken: sessionToken 
          }),
        });
        console.log(`Success with endpoint: ${endpoint}`);
        return result;
      } else {
        // Direct API call with auth headers
        const headers: Record<string, string> = {
          'Accept': 'application/json',
        };
        
        if (sessionToken) {
          headers['Authorization'] = `Bearer ${sessionToken}`;
        }
        
        const result = await apiCall<AssignedPatientsResponse>(endpoint, {
          method: 'GET',
          headers: headers,
        });
        console.log(`Success with endpoint: ${endpoint}`);
        return result;
      }
    } catch (error: any) {
      console.log(`Failed with endpoint ${endpoint}:`, error.message);
      lastError = error;
      continue;
    }
  }
  
  // If all endpoints failed, throw the last error
  throw new Error(`All care provider endpoints failed. Last error: ${lastError?.message}. Please check if the backend has care provider routes implemented.`);
}

export async function getPatientRecords(patientUserId: string, recordType: string = 'MED'): Promise<PatientRecordsResponse> {
  const endpoint = `/care-provider/patients/${patientUserId}/records?recordType=${recordType}`;
  
  // Get session token if available
  const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('sessionToken') : null;
  
  if (USE_PROXY && isClient) {
    // Use proxy for GET requests too
    return apiCall<PatientRecordsResponse>(endpoint, {
      body: JSON.stringify({ 
        method: 'GET',
        sessionToken: sessionToken 
      }),
    });
  } else {
    // Direct API call with auth headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    
    return apiCall<PatientRecordsResponse>(endpoint, {
      method: 'GET',
      headers: headers,
    });
  }
}

// User Management API Functions
export interface UsersListResponse {
  success: boolean;
  users: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
    isActive?: boolean;
  }>;
  total: number;
  page: number;
  limit: number;
}

export interface RecordsListResponse {
  success: boolean;
  records: Array<{
    _id: string;
    userId: string;
    userRole: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    isActive?: boolean;
  }>;
  total: number;
  page: number;
  limit: number;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
  };
}

export interface SingleUserResponse {
  success: boolean;
  user: {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    isActive?: boolean;
    phone?: string;
    profileImage?: string;
  };
}

export async function getAllRecords(params: { page?: number; limit?: number; userRole?: string; search?: string } = {}): Promise<RecordsListResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.userRole) queryParams.append('userRole', params.userRole);
  if (params.search) queryParams.append('search', params.search);
  
  const endpoint = `/user-management/records${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  // Get session token if available
  const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('sessionToken') : null;
  
  if (USE_PROXY && isClient) {
    return apiCall<RecordsListResponse>(endpoint, {
      body: JSON.stringify({ 
        method: 'GET',
        sessionToken: sessionToken 
      }),
    });
  } else {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    
    return apiCall<RecordsListResponse>(endpoint, {
      method: 'GET',
      headers: headers,
    });
  }
}

export async function getUsersList(params: { page?: number; limit?: number; search?: string } = {}): Promise<UsersListResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  
  const endpoint = `/user-management/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  // Get session token if available
  const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('sessionToken') : null;
  
  if (USE_PROXY && isClient) {
    return apiCall<UsersListResponse>(endpoint, {
      body: JSON.stringify({ 
        method: 'GET',
        sessionToken: sessionToken 
      }),
    });
  } else {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    
    return apiCall<UsersListResponse>(endpoint, {
      method: 'GET',
      headers: headers,
    });
  }
}

export async function getPractitionersList(params: { page?: number; limit?: number; search?: string } = {}): Promise<UsersListResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  
  const endpoint = `/user-management/practitioners${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  // Get session token if available
  const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('sessionToken') : null;
  
  if (USE_PROXY && isClient) {
    return apiCall<UsersListResponse>(endpoint, {
      body: JSON.stringify({ 
        method: 'GET',
        sessionToken: sessionToken 
      }),
    });
  } else {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    
    return apiCall<UsersListResponse>(endpoint, {
      method: 'GET',
      headers: headers,
    });
  }
}

export async function getPatientsList(params: { page?: number; limit?: number; search?: string } = {}): Promise<UsersListResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  
  const endpoint = `/user-management/patients${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  // Get session token if available
  const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('sessionToken') : null;
  
  if (USE_PROXY && isClient) {
    return apiCall<UsersListResponse>(endpoint, {
      body: JSON.stringify({ 
        method: 'GET',
        sessionToken: sessionToken 
      }),
    });
  } else {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    
    return apiCall<UsersListResponse>(endpoint, {
      method: 'GET',
      headers: headers,
    });
  }
}

export async function getUserById(userId: string): Promise<SingleUserResponse> {
  const endpoint = `/user-management/users/${userId}`;
  
  // Get session token if available
  const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('sessionToken') : null;
  
  if (USE_PROXY && isClient) {
    return apiCall<SingleUserResponse>(endpoint, {
      body: JSON.stringify({ 
        method: 'GET',
        sessionToken: sessionToken 
      }),
    });
  } else {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    
    return apiCall<SingleUserResponse>(endpoint, {
      method: 'GET',
      headers: headers,
    });
  }
}

export async function createNewUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
  const endpoint = '/user-management/users';
  
  // Get session token if available
  const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('sessionToken') : null;
  
  if (USE_PROXY && isClient) {
    return apiCall<CreateUserResponse>(endpoint, {
      body: JSON.stringify({ 
        ...userData,
        sessionToken: sessionToken 
      }),
    });
  } else {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    
    return apiCall<CreateUserResponse>(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(userData),
    });
  }
}