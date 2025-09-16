'use client';

import { useState } from 'react';
import { API_CONFIG, isDevelopment } from '@/lib/config';
import SimpleCaptcha from './SimpleCaptcha';

interface CaptchaFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CaptchaField({ value, onChange }: CaptchaFieldProps) {
  const [useDevBypass, setUseDevBypass] = useState(false);

  if (isDevelopment && useDevBypass) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          CAPTCHA Verification (Development Mode)
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter CAPTCHA token"
        />
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
          <p className="text-xs text-yellow-800">
            <strong>Development Mode:</strong> Try using: <code className="bg-yellow-100 px-1 rounded">{API_CONFIG.DEV.DUMMY_CAPTCHA}</code>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUseDevBypass(false)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Switch to Math CAPTCHA
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <SimpleCaptcha value={value} onCaptchaChange={onChange} />
      {isDevelopment && (
        <button
          type="button"
          onClick={() => {
            setUseDevBypass(true);
            onChange(API_CONFIG.DEV.DUMMY_CAPTCHA);
          }}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Use Development CAPTCHA Token
        </button>
      )}
    </div>
  );
}