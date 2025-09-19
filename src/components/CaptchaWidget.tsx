'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
    hcaptcha: any;
  }
}

interface CaptchaWidgetProps {
  provider?: 'recaptcha' | 'hcaptcha';
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpired?: () => void;
}

export default function CaptchaWidget({ 
  provider = 'recaptcha', 
  onVerify, 
  onError, 
  onExpired 
}: CaptchaWidgetProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [widgetId, setWidgetId] = useState<string | number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const siteKey = provider === 'recaptcha' 
    ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY 
    : process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  // Check if we have a valid site key (not placeholder)
  const isValidSiteKey = siteKey && 
    siteKey !== 'your_recaptcha_site_key_here' && 
    siteKey !== 'your_hcaptcha_site_key_here' &&
    siteKey.length > 10;

  useEffect(() => {
    if (!isValidSiteKey) {
      // No valid site key configured - require proper CAPTCHA setup
      return;
    }

    // Prevent multiple renders
    if (widgetId !== null) {
      return;
    }

    const loadScript = () => {
      if (provider === 'recaptcha' && window.grecaptcha) {
        initializeRecaptcha();
        return;
      }
      
      if (provider === 'hcaptcha' && window.hcaptcha) {
        initializeHcaptcha();
        return;
      }

      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src*="${provider === 'recaptcha' ? 'recaptcha' : 'hcaptcha'}"]`);
      if (existingScript) {
        // Script exists, wait for it to load
        const checkLoaded = () => {
          if (provider === 'recaptcha' && window.grecaptcha) {
            initializeRecaptcha();
          } else if (provider === 'hcaptcha' && window.hcaptcha) {
            initializeHcaptcha();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      const script = document.createElement('script');
      script.src = provider === 'recaptcha' 
        ? 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
        : 'https://js.hcaptcha.com/1/api.js?onload=onHcaptchaLoad&render=explicit';
      
      script.async = true;
      script.defer = true;

      const callbackName = provider === 'recaptcha' ? 'onRecaptchaLoad' : 'onHcaptchaLoad';
      (window as any)[callbackName] = () => {
        setIsLoaded(true);
        if (provider === 'recaptcha') {
          initializeRecaptcha();
        } else {
          initializeHcaptcha();
        }
      };

      document.head.appendChild(script);
    };

    const initializeRecaptcha = () => {
      if (containerRef.current && window.grecaptcha && widgetId === null) {
        // Clear any existing content
        containerRef.current.innerHTML = '';
        
        try {
          const id = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            'expired-callback': onExpired,
            'error-callback': onError,
          });
          setWidgetId(id);
        } catch (error) {
          console.warn('reCAPTCHA render error:', error);
          onError?.('Failed to load reCAPTCHA');
        }
      }
    };

    const initializeHcaptcha = () => {
      if (containerRef.current && window.hcaptcha && widgetId === null) {
        // Clear any existing content
        containerRef.current.innerHTML = '';
        
        try {
          const id = window.hcaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            'expired-callback': onExpired,
            'error-callback': onError,
          });
          setWidgetId(id);
        } catch (error) {
          console.warn('hCaptcha render error:', error);
          onError?.('Failed to load hCaptcha');
        }
      }
    };

    loadScript();

    return () => {
      // Cleanup
      if (widgetId !== null && containerRef.current) {
        try {
          if (provider === 'recaptcha' && window.grecaptcha) {
            window.grecaptcha.reset(widgetId);
          } else if (provider === 'hcaptcha' && window.hcaptcha) {
            window.hcaptcha.reset(widgetId);
          }
        } catch (error) {
          console.warn('Error resetting CAPTCHA during cleanup:', error);
        }
        
        // Clear the container
        containerRef.current.innerHTML = '';
        setWidgetId(null);
      }
    };
  }, [provider, siteKey]);

  const reset = () => {
    if (widgetId !== null && containerRef.current) {
      try {
        if (provider === 'recaptcha' && window.grecaptcha) {
          window.grecaptcha.reset(widgetId);
        } else if (provider === 'hcaptcha' && window.hcaptcha) {
          window.hcaptcha.reset(widgetId);
        }
      } catch (error) {
        console.warn('Error resetting CAPTCHA:', error);
        // If reset fails, try to recreate the widget
        containerRef.current.innerHTML = '';
        setWidgetId(null);
        setIsLoaded(false);
      }
    }
  };

  if (!isValidSiteKey) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Security Verification
        </label>
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-sm text-red-800">
            CAPTCHA configuration required. Please configure CAPTCHA site key.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Security Verification
      </label>
      <div ref={containerRef} className="flex justify-center"></div>
      {isLoaded && (
        <button
          type="button"
          onClick={reset}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Reset CAPTCHA
        </button>
      )}
    </div>
  );
}