import { config } from './config';

// For debugging
const DEBUG = true;

export interface Participant {
  userId: string;
  userType: string;
  permissionScope: string;
  accepted: boolean;
}

export interface AppointmentLocation {
  type: number;
}

export interface PatientMetadata {
  isPatientTravelling: boolean;
  patientLocation: string;
  patientLocationType: string;
}

export interface AppointmentTimestamps {
  scheduledStartTime: string;
  scheduledEndTime: string;
}

export interface Appointment {
  _id?: string;
  title: string;
  description: string;
  location: AppointmentLocation;
  patientMetadata: PatientMetadata;
  participants: Participant[];
  timestamps: AppointmentTimestamps;
}

export interface AppointmentResponse {
  success: boolean;
  message?: string;
  appointments?: Appointment[];
  appointment?: Appointment;
  total?: number;
}

const BASE_URL = config.baseURL;

export const appointmentApi = {
  // Get all appointments (for practitioners/admins)
  getAppointments: async (page = 1, limit = 10): Promise<AppointmentResponse> => {
    try {
      const url = `${BASE_URL}/appointments?page=${page}&limit=${limit}`;
      const token = sessionStorage.getItem('sessionToken');
      
      if (DEBUG) {
        console.log('Fetching appointments:', {
          url,
          hasToken: !!token,
          method: 'GET'
        });
      }

      const response = await fetch(url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (DEBUG) {
        console.log('Appointments API Response:', data);
      }

      return data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch appointments: ${error.message}`);
      }
      throw error;
    }
  },

  // Get personal appointments
  getPersonalAppointments: async (page = 1, limit = 10): Promise<AppointmentResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/appointments/personal?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch personal appointments');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching personal appointments:', error);
      throw error;
    }
  },

  // Get personal appointment by ID
  getPersonalAppointment: async (appointmentId: string): Promise<AppointmentResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/appointments/personal/${appointmentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch personal appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching personal appointment:', error);
      throw error;
    }
  },

  // Join an appointment
  joinAppointment: async (appointmentId: string): Promise<AppointmentResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/appointments/personal/join/${appointmentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to join appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error joining appointment:', error);
      throw error;
    }
  },

  // Accept an appointment
  acceptAppointment: async (appointmentId: string): Promise<AppointmentResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/appointments/personal/accept/${appointmentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to accept appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error accepting appointment:', error);
      throw error;
    }
  },

  // Get appointment by ID
  getAppointment: async (appointmentId: string): Promise<AppointmentResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/appointments/${appointmentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  // Create new appointment
  createAppointment: async (appointment: Appointment): Promise<AppointmentResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/appointments/schedule`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
          },
          body: JSON.stringify(appointment),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Update appointment
  updateAppointment: async (appointmentId: string, appointment: Partial<Appointment>): Promise<AppointmentResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/appointments/${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
          },
          body: JSON.stringify(appointment),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Delete appointment
  deleteAppointment: async (appointmentId: string): Promise<AppointmentResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/appointments/${appointmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },
};