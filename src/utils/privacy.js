import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'diggai-privacy-consent';

const DEFAULT_CONSENT = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: null
};

/**
 * SSR-safe localStorage getter
 * @returns {object} Parsed consent or default
 */
function getStoredConsent() {
  if (typeof window === 'undefined') {
    return DEFAULT_CONSENT;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_CONSENT;
  } catch {
    // localStorage blocked or JSON parse error
    return DEFAULT_CONSENT;
  }
}

/**
 * SSR-safe localStorage setter
 * @param {object} consent - Consent object to store
 */
function setStoredConsent(consent) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // localStorage blocked - silent fail (privacy-friendly)
  }
}

/**
 * Privacy consent management hook
 * DSGVO-compliant cookie and tracking consent
 * @security Handles PII consent preferences - never logs consent choices
 */
export const usePrivacyConsent = () => {
  const [consent, setConsent] = useState(DEFAULT_CONSENT);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    setConsent(getStoredConsent());
    setIsHydrated(true);
  }, []);

  const updateConsent = useCallback((newConsent) => {
    const updatedConsent = {
      ...consent,
      ...newConsent,
      timestamp: new Date().toISOString()
    };
    setConsent(updatedConsent);
    setStoredConsent(updatedConsent);
  }, [consent]);

  const hasConsented = isHydrated && consent.timestamp !== null;

  return { consent, updateConsent, hasConsented, isHydrated };
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
