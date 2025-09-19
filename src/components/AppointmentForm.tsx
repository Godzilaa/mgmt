'use client';

import { useState, useEffect } from 'react';
import { Appointment, Participant } from '@/lib/appointmentApi';

interface AppointmentFormProps {
  appointment?: Appointment;
  onSubmit: (appointment: Appointment) => Promise<void>;
  onCancel: () => void;
}

export default function AppointmentForm({ appointment, onSubmit, onCancel }: AppointmentFormProps) {
  const [formData, setFormData] = useState<Appointment>({
    title: '',
    description: '',
    location: {
      type: 1
    },
    patientMetadata: {
      isPatientTravelling: false,
      patientLocation: 'Outpatient Clinic',
      patientLocationType: 'within'
    },
    participants: [],
    timestamps: {
      scheduledStartTime: '',
      scheduledEndTime: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to save appointment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipantChange = (index: number, field: keyof Participant, value: string | boolean) => {
    const updatedParticipants = [...formData.participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value
    };
    setFormData({ ...formData, participants: updatedParticipants });
  };

  const addParticipant = () => {
    setFormData({
      ...formData,
      participants: [
        ...formData.participants,
        {
          userId: '',
          userType: 'U_PAT',
          permissionScope: 'Attendee',
          accepted: false
        }
      ]
    });
  };

  const removeParticipant = (index: number) => {
    const updatedParticipants = formData.participants.filter((_, i) => i !== index);
    setFormData({ ...formData, participants: updatedParticipants });
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Timing */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Time</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                value={formData.timestamps.scheduledStartTime.split('.')[0]}
                onChange={(e) => setFormData({
                  ...formData,
                  timestamps: {
                    ...formData.timestamps,
                    scheduledStartTime: new Date(e.target.value).toISOString()
                  }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="datetime-local"
                value={formData.timestamps.scheduledEndTime.split('.')[0]}
                onChange={(e) => setFormData({
                  ...formData,
                  timestamps: {
                    ...formData.timestamps,
                    scheduledEndTime: new Date(e.target.value).toISOString()
                  }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Location Details</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location Type</label>
              <select
                value={formData.location.type}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { type: parseInt(e.target.value) }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={1}>In-Person</option>
                <option value={2}>Virtual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Location</label>
              <input
                type="text"
                value={formData.patientMetadata.patientLocation}
                onChange={(e) => setFormData({
                  ...formData,
                  patientMetadata: {
                    ...formData.patientMetadata,
                    patientLocation: e.target.value
                  }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Participants */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Participants</h3>
            <button
              type="button"
              onClick={addParticipant}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
            >
              Add Participant
            </button>
          </div>
          {formData.participants.map((participant, index) => (
            <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4 p-4 border border-gray-200 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <input
                  type="text"
                  value={participant.userId}
                  onChange={(e) => handleParticipantChange(index, 'userId', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">User Type</label>
                <select
                  value={participant.userType}
                  onChange={(e) => handleParticipantChange(index, 'userType', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="U_PAT">Patient</option>
                  <option value="U_PRAC">Practitioner</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeParticipant(index)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}