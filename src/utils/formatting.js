/**
 * Format number to Rupiah currency format
 * @param {number} number - The number to format
 * @returns {string} Formatted rupiah string
 */
export const formatRp = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number || 0);
};

/**
 * Format number to simple format (e.g., 1.5k, 2M)
 * @param {number} number - The number to format
 * @returns {string} Formatted number
 */
export const formatCompactNumber = (number) => {
  return new Intl.NumberFormat('id-ID', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(number || 0);
};

/**
 * Validate Indonesian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
export const isValidPhoneNumber = (phone) => {
  // Accept numbers starting with 0, +62, or 62
  const regex = /^(\+62|62|0)[0-9]{9,12}$/;
  return regex.test(phone?.replace(/\s/g, ''));
};

/**
 * Clean phone number format (remove spaces, dashes)
 * @param {string} phone - Raw phone number
 * @returns {string} Cleaned phone number
 */
export const cleanPhoneNumber = (phone) => {
  return phone?.replace(/[\s\-()]/g, '') || '';
};

/**
 * Format date to Indonesian format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date short version
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted short date
 */
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    month: 'short',
    day: 'numeric'
  });
};
