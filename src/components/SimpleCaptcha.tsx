'use client';

import { useState, useEffect } from 'react';

interface SimpleCaptchaProps {
  onCaptchaChange: (value: string) => void;
  value: string;
}

export default function SimpleCaptcha({ onCaptchaChange, value }: SimpleCaptchaProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let result;
    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      default:
        result = num1 + num2;
    }
    
    setQuestion(`${num1} ${operator} ${num2} = ?`);
    setAnswer(result.toString());
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleRefresh = () => {
    generateCaptcha();
    onCaptchaChange(''); // Clear the input when refreshing
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Security Verification
      </label>
      
      <div className="flex items-center space-x-2">
        <div className="bg-gray-100 border border-gray-300 rounded px-3 py-2 font-mono text-lg">
          {question}
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="text-indigo-600 hover:text-indigo-800 text-sm underline"
        >
          Refresh
        </button>
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onCaptchaChange(e.target.value)}
        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Enter your answer"
        required
      />
      
      <p className="text-xs text-gray-500">
        Solve the math problem above to verify you're human
      </p>
      
      {/* Hidden field with the correct answer for validation */}
      <input type="hidden" value={answer} data-testid="captcha-answer" />
    </div>
  );
}