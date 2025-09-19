'use client';

import { useState, useEffect } from 'react';
import { appointmentApi, Appointment } from '@/lib/appointmentApi';

export default function PersonalAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadAppointments();
  }, [currentPage]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentApi.getPersonalAppointments(currentPage);
      if (response.success && response.appointments) {
        setAppointments(response.appointments);
        if (response.total) {
          setTotalPages(Math.ceil(response.total / 10));
        }
      } else {
        setError(response.message || 'Failed to load appointments');
      }
    } catch (err) {
      setError('Error loading appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId: string) => {
    try {
      setLoading(true);
      const response = await appointmentApi.acceptAppointment(appointmentId);
      if (response.success) {
        await loadAppointments();
      } else {
        setError(response.message || 'Failed to accept appointment');
      }
    } catch (err) {
      setError('Error accepting appointment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (appointmentId: string) => {
    try {
      setLoading(true);
      const response = await appointmentApi.joinAppointment(appointmentId);
      if (response.success) {
        await loadAppointments();
      } else {
        setError(response.message || 'Failed to join appointment');
      }
    } catch (err) {
      setError('Error joining appointment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
              <p className="mt-2 text-gray-600">View and manage your appointments</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li key={appointment._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-indigo-600 truncate">{appointment.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{appointment.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      {!appointment.participants.find(p => 
                        p.userId === sessionStorage.getItem('userId') && p.accepted
                      ) && (
                        <button
                          onClick={() => appointment._id && handleAccept(appointment._id)}
                          className="px-3 py-1 text-sm text-green-600 bg-green-100 hover:bg-green-200 rounded-md"
                        >
                          Accept
                        </button>
                      )}
                      {appointment.participants.find(p => 
                        p.userId === sessionStorage.getItem('userId') && p.accepted
                      ) && (
                        <button
                          onClick={() => appointment._id && handleJoin(appointment._id)}
                          className="px-3 py-1 text-sm text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-md"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {formatDateTime(appointment.timestamps.scheduledStartTime)}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {appointment.patientMetadata.patientLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}