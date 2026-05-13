/**
 * API and Error handling utilities
 */

import { ERROR_MESSAGES, HTTP_STATUS } from './constants';

/**
 * Handle API errors with proper messaging
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);

  // Network error
  if (!error.response) {
    return {
      status: 0,
      message: ERROR_MESSAGES.NETWORK_ERROR,
      originalError: error
    };
  }

  const status = error.response?.status;
  const data = error.response?.data;

  let message = ERROR_MESSAGES.UNKNOWN_ERROR;

  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      message = data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
      break;
    case HTTP_STATUS.UNAUTHORIZED:
      message = ERROR_MESSAGES.AUTH_FAILED;
      break;
    case HTTP_STATUS.FORBIDDEN:
      message = ERROR_MESSAGES.FORBIDDEN;
      break;
    case HTTP_STATUS.NOT_FOUND:
      message = ERROR_MESSAGES.NOT_FOUND;
      break;
    case HTTP_STATUS.CONFLICT:
      message = data?.message || 'Data sudah ada.';
      break;
    case HTTP_STATUS.SERVER_ERROR:
      message = ERROR_MESSAGES.SERVER_ERROR;
      break;
    default:
      message = data?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  return {
    status,
    message,
    originalError: error
  };
};

/**
 * Validate API response
 */
export const isValidResponse = (response) => {
  return response && response.status >= HTTP_STATUS.OK && response.status < 300;
};

/**
 * Format error message for user display
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

/**
 * Retry logic for failed requests
 */
export const retryAsync = async (fn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

/**
 * Debounce function for event handlers
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance
 */
export const throttle = (func, limit = 1000) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Get value from nested object safely
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
  try {
    const value = path.split('.').reduce((acc, part) => acc?.[part], obj);
    return value !== undefined ? value : defaultValue;
  } catch {
    return defaultValue;
  }
};
