import DOMPurify from 'dompurify';

/**
 * Security utilities for input validation and sanitization
 * DSGVO-compliant data handling
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} dirty - The unsanitized HTML string
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'span'],
    ALLOWED_ATTR: []
  });
};

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
};

/**
 * Validates phone number (German format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Hyphen at end of character class to avoid escape
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[\s.-]?[(]?[0-9]{1,4}[)]?[\s.-]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.trim());
};

/**
 * Validates and sanitizes text input
 * @param {string} input - User input text
 * @param {number} maxLength - Maximum allowed length
 * @returns {object} - {isValid: boolean, sanitized: string, error: string}
 */
export const validateTextInput = (input, maxLength = 1000) => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, sanitized: '', error: 'Input is required' };
  }
  
  const trimmed = input.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, sanitized: '', error: 'Input cannot be empty' };
  }
  
  if (trimmed.length > maxLength) {
    return { 
      isValid: false, 
      sanitized: trimmed.substring(0, maxLength), 
      error: `Input exceeds maximum length of ${maxLength} characters` 
    };
  }
  
  // Remove potential script tags and dangerous characters
  const sanitized = trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
  
  return { isValid: true, sanitized, error: null };
};

/**
 * Validates numeric input
 * @param {string|number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {object} - {isValid: boolean, value: number, error: string}
 */
export const validateNumericInput = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const num = Number(value);
  
  if (isNaN(num)) {
    return { isValid: false, value: 0, error: 'Value must be a number' };
  }
  
  if (num < min) {
    return { isValid: false, value: num, error: `Value must be at least ${min}` };
  }
  
  if (num > max) {
    return { isValid: false, value: num, error: `Value must not exceed ${max}` };
  }
  
  return { isValid: true, value: num, error: null };
};

/**
 * Validates URL format and protocol
 * Only allows https URLs from trusted domains
 * @param {string} url - URL to validate
 * @param {string[]} allowedDomains - List of allowed domains (default: GitHub)
 * @returns {object} - {isValid: boolean, url: string, error: string}
 */
export const validateURL = (url, allowedDomains = ['github.com']) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, url: '', error: 'URL is required' };
  }

  const trimmedUrl = url.trim();

  // Validate URL format using URL constructor
  let parsedUrl;
  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    return { isValid: false, url: trimmedUrl, error: 'Invalid URL format' };
  }

  // Only allow HTTPS protocol for security
  if (parsedUrl.protocol !== 'https:') {
    return { isValid: false, url: trimmedUrl, error: 'Only HTTPS URLs are allowed' };
  }

  // Check if domain is in allowed list
  const hostname = parsedUrl.hostname.toLowerCase();
  const isAllowedDomain = allowedDomains.some(domain => 
    hostname === domain || hostname.endsWith(`.${domain}`)
  );

  if (!isAllowedDomain) {
    return { 
      isValid: false, 
      url: trimmedUrl, 
      error: `Domain not allowed. Allowed: ${allowedDomains.join(', ')}` 
    };
  }

  return { isValid: true, url: parsedUrl.href, error: null };
};

/**
 * Rate limiting helper for API calls
 * @param {Function} fn - Function to rate limit
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Rate limited function
 */
export const rateLimit = (fn, delay = 1000) => {
  let timeoutId = null;
  let lastRan = 0;
  
  return function(...args) {
    const context = this;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const timeSinceLastRan = Date.now() - lastRan;
    
    if (timeSinceLastRan >= delay) {
      fn.apply(context, args);
      lastRan = Date.now();
    } else {
      timeoutId = setTimeout(() => {
        fn.apply(context, args);
        lastRan = Date.now();
      }, delay - timeSinceLastRan);
    }
  };
};
