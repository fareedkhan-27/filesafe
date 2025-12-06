// Date helper utilities

/**
 * Format a date string into a readable format
 */
export const formatDate = (dateString: string | undefined, format: 'short' | 'long' = 'short'): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  if (format === 'long') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Format date to DD/MM/YYYY
 */
export const formatDateDDMMYYYY = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Check if a date is expiring soon (within days)
 */
export const isExpiringSoon = (dateString: string | undefined, daysAhead: number = 90): boolean => {
  if (!dateString) return false;

  const expiryDate = new Date(dateString);
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return expiryDate >= now && expiryDate <= futureDate;
};

/**
 * Check if a date is expired
 */
export const isExpired = (dateString: string | undefined): boolean => {
  if (!dateString) return false;

  const expiryDate = new Date(dateString);
  const now = new Date();

  return expiryDate < now;
};

/**
 * Get days until expiry (negative if expired)
 */
export const getDaysUntilExpiry = (dateString: string | undefined): number | null => {
  if (!dateString) return null;

  const expiryDate = new Date(dateString);
  const now = new Date();

  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Get a human-readable expiry status
 */
export const getExpiryStatus = (dateString: string | undefined): {
  status: 'expired' | 'expiring_soon' | 'valid' | 'unknown';
  message: string;
  color: string;
} => {
  if (!dateString) {
    return { status: 'unknown', message: 'No expiry date', color: 'gray' };
  }

  const days = getDaysUntilExpiry(dateString);

  if (days === null) {
    return { status: 'unknown', message: 'Invalid date', color: 'gray' };
  }

  if (days < 0) {
    return { status: 'expired', message: `Expired ${Math.abs(days)} days ago`, color: 'red' };
  }

  if (days <= 30) {
    return { status: 'expiring_soon', message: `Expires in ${days} days`, color: 'orange' };
  }

  if (days <= 90) {
    return { status: 'expiring_soon', message: `Expires in ${days} days`, color: 'yellow' };
  }

  return { status: 'valid', message: `Valid for ${days} days`, color: 'green' };
};
