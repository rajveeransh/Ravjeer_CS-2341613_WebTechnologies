/**
 * utils/formatCurrency.js
 * Formats a number as Indian Rupees (₹).
 */

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
