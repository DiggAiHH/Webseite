import { useState, useEffect } from 'react';

/**
 * Privacy consent management hook
 * DSGVO-compliant cookie and tracking consent
 */
export const usePrivacyConsent = () => {
  const [consent, setConsent] = useState(() => {
    const stored = localStorage.getItem('diggai-privacy-consent');
    return stored ? JSON.parse(stored) : {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: null
    };
  });

  const updateConsent = (newConsent) => {
    const updatedConsent = {
      ...consent,
      ...newConsent,
      timestamp: new Date().toISOString()
    };
    setConsent(updatedConsent);
    localStorage.setItem('diggai-privacy-consent', JSON.stringify(updatedConsent));
  };

  const hasConsented = consent.timestamp !== null;

  return { consent, updateConsent, hasConsented };
};

/**
 * Session timeout hook for security
 */
export const useSessionTimeout = (timeoutMinutes = 30) => {
  const [isActive, setIsActive] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setIsActive(true);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    const interval = setInterval(() => {
      const now = Date.now();
      const timeDiff = now - lastActivity;
      if (timeDiff > timeoutMinutes * 60 * 1000) {
        setIsActive(false);
      }
    }, 60000); // Check every minute

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity, timeoutMinutes]);

  return { isActive, lastActivity };
};
