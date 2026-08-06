/**
 * Inventria Formatting & Style Utilities
 * Formatted for Indian Rupee (INR - ₹) and Indian numbering system (e.g. ₹1,23,456.75)
 */

// Format numbers as INR currency (₹1,23,456.75)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format standard integer with Indian commas (1,23,456)
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format ISO date strings (2026-08-06 -> Aug 06, 2026)
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

// Color badge variants based on inventory status or order status
export const getStatusBadgeVariant = (status) => {
  if (!status) return 'default';
  const normalized = status.toLowerCase();

  switch (normalized) {
    case 'in stock':
    case 'active':
    case 'delivered':
    case 'received':
    case 'approved':
    case 'healthy':
    case 'paid':
      return 'success';

    case 'low stock':
    case 'pending':
    case 'processing':
    case 'shipped':
    case 'warning':
    case 'near capacity':
      return 'warning';

    case 'out of stock':
    case 'inactive':
    case 'cancelled':
    case 'rejected':
    case 'critical':
    case 'over capacity':
      return 'danger';

    case 'draft':
    case 'new':
      return 'secondary';

    default:
      return 'primary';
  }
};
