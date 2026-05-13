/**
 * Advanced data manipulation utilities
 */

/**
 * Paginate array
 * @param {Array} items - Items to paginate
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Object} { items, totalPages, currentPage, total }
 */
export const paginate = (items = [], page = 1, pageSize = 10) => {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: items.slice(startIndex, endIndex),
    total,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Sort array by key
 * @param {Array} items - Items to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortByKey = (items = [], key, order = 'asc') => {
  const sorted = [...items].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

/**
 * Filter array by multiple criteria
 * @param {Array} items - Items to filter
 * @param {Object} criteria - Filter criteria { key: value }
 * @returns {Array} Filtered array
 */
export const filterByMultiple = (items = [], criteria = {}) => {
  return items.filter(item => {
    return Object.entries(criteria).every(([key, value]) => {
      if (value === null || value === undefined || value === '') return true;
      if (Array.isArray(value)) return value.includes(item[key]);
      return item[key] === value;
    });
  });
};

/**
 * Search items by text
 * @param {Array} items - Items to search
 * @param {string} searchTerm - Search term
 * @param {Array} searchKeys - Keys to search in
 * @returns {Array} Matching items
 */
export const searchItems = (items = [], searchTerm = '', searchKeys = []) => {
  if (!searchTerm.trim()) return items;

  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    searchKeys.some(key => {
      const value = String(item[key] || '').toLowerCase();
      return value.includes(term);
    })
  );
};

/**
 * Group items by key
 * @param {Array} items - Items to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped items { groupValue: [...items] }
 */
export const groupBy = (items = [], key) => {
  return items.reduce((acc, item) => {
    const groupValue = item[key];
    if (!acc[groupValue]) acc[groupValue] = [];
    acc[groupValue].push(item);
    return acc;
  }, {});
};

/**
 * Sum values by key
 * @param {Array} items - Items to sum
 * @param {string} key - Key to sum
 * @returns {number} Sum total
 */
export const sumByKey = (items = [], key) => {
  return items.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
};

/**
 * Get unique values from array
 * @param {Array} items - Items to filter
 * @param {string} key - Key to get unique values from
 * @returns {Array} Unique items
 */
export const getUnique = (items = [], key) => {
  const seen = new Set();
  return items.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Get object properties by keys
 * @param {Object} obj - Object to extract from
 * @param {Array} keys - Keys to extract
 * @returns {Object} New object with only specified keys
 */
export const pick = (obj, keys = []) => {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
};

/**
 * Exclude object properties by keys
 * @param {Object} obj - Object to extract from
 * @param {Array} keys - Keys to exclude
 * @returns {Object} New object without specified keys
 */
export const omit = (obj, keys = []) => {
  const keySet = new Set(keys);
  return Object.keys(obj).reduce((acc, key) => {
    if (!keySet.has(key)) acc[key] = obj[key];
    return acc;
  }, {});
};

/**
 * Merge multiple objects
 * @param {...Object} objects - Objects to merge
 * @returns {Object} Merged object
 */
export const mergeObjects = (...objects) => {
  return Object.assign({}, ...objects);
};

/**
 * Deep clone object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if date is within range
 * @param {Date|string} date - Date to check
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {boolean} Is within range
 */
export const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
};

/**
 * Get date range (last N days)
 * @param {number} days - Number of days
 * @returns {Object} { startDate, endDate }
 */
export const getDateRange = (days = 30) => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

/**
 * Download file
 * @param {Blob} blob - File blob
 * @param {string} filename - Filename
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise} Copy result
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
