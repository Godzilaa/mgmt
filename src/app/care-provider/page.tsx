'use client';

import { useState, useEffect } from 'react';
import { getAssignedPatients, getPatientRecords } from '@/lib/api';

interface Patient {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  assignedAt: string;
}

interface PatientRecord {
  _id: string;
  recordType: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export default function CareProviderPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordType, setRecordType] = useState('MED');

  useEffect(() => {
    loadAssignedPatients();
  }, []);

  const loadAssignedPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAssignedPatients();
      setPatients(data.patients || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load assigned patients');
    } finally {
      setLoading(false);
    }
  };

  const loadPatientRecords = async (patientUserId: string, type: string = 'MED') => {
    try {
      setRecordsLoading(true);
      setError(null);
      const data = await getPatientRecords(patientUserId, type);
      setPatientRecords(data.records || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load patient records');
    } finally {
      setRecordsLoading(false);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    loadPatientRecords(patient.userId, recordType);
  };

  const handleRecordTypeChange = (type: string) => {
    setRecordType(type);
    if (selectedPatient) {
      loadPatientRecords(selectedPatient.userId, type);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <a
                href="/dashboard"
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </a>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Care Provider Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your assigned patients and view their records</p>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assigned Patients */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Assigned Patients</h2>
                <button
                  onClick={loadAssignedPatients}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading patients...</p>
                </div>
              ) : patients.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No assigned patients</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any patients assigned to you yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patients.map((patient) => (
                    <div
                      key={patient._id}
                      onClick={() => handlePatientSelect(patient)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPatient?._id === patient._id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{patient.email}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          Assigned: {new Date(patient.assignedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Patient Records */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Patient Records</h2>
                {selectedPatient && (
                  <div className="flex items-center space-x-3">
                    <select
                      value={recordType}
                      onChange={(e) => handleRecordTypeChange(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="MED">Medical Records</option>
                      <option value="LAB">Lab Results</option>
                      <option value="VITAL">Vital Signs</option>
                      <option value="NOTES">Clinical Notes</option>
                    </select>
                  </div>
                )}
              </div>

              {!selectedPatient ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a patient</h3>
                  <p className="mt-1 text-sm text-gray-500">Choose a patient from the left to view their records.</p>
                </div>
              ) : recordsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading records...</p>
                </div>
              ) : patientRecords.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No {recordType.toLowerCase()} records found for {selectedPatient.firstName} {selectedPatient.lastName}.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      Viewing {recordType.toLowerCase()} records for{' '}
                      <span className="font-medium">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </span>
                    </p>
                  </div>
                  
                  {patientRecords.map((record) => (
                    <div key={record._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {record.recordType}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(record.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2">
                        <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                          {JSON.stringify(record.data, null, 2)}
                        </pre>
                      </div>
                      {record.updatedAt !== record.createdAt && (
                        <div className="mt-2 text-xs text-gray-400">
                          Last updated: {new Date(record.updatedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}