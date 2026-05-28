/**
 * Formatting utility functions for numbers, dates, and phone numbers.
 * All formatters follow Brazilian Portuguese conventions.
 */

/**
 * Formats a number to a specified number of decimal places.
 * Uses Brazilian locale (comma as decimal separator).
 *
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Formats a number using Brazilian locale (dot as thousands separator, comma as decimal).
 *
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string in pt-BR locale
 */
export function formatNumberBR(value: number, decimals: number = 2): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a distance value in kilometers.
 *
 * @param distanceKm - Distance in kilometers
 * @returns Formatted distance string (e.g., "2,5 km")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${formatNumberBR(distanceKm, 1)} km`;
}

/**
 * Formats a phone number in Brazilian format.
 * Handles both landline (10 digits) and mobile (11 digits) numbers.
 *
 * @param phone - Phone number string (digits only or formatted)
 * @returns Formatted phone string (e.g., "(11) 91234-5678")
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  // Return as-is if it doesn't match expected lengths
  return phone;
}

/**
 * Formats a CEP (Brazilian postal code) with hyphen.
 *
 * @param cep - CEP string (digits only or formatted)
 * @returns Formatted CEP string (e.g., "01504-001")
 */
export function formatCep(cep: string): string {
  const digits = cep.replace(/\D/g, '');

  if (digits.length === 8) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  return cep;
}

/**
 * Formats a date in Brazilian format (DD/MM/YYYY).
 *
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formats a waiting period duration in days to a human-readable string.
 *
 * @param days - Number of days
 * @returns Formatted duration string (e.g., "30 dias", "180 dias")
 */
export function formatWaitingPeriod(days: number): string {
  if (days === 0) {
    return 'Sem carência';
  }
  if (days === 1) {
    return '1 dia';
  }
  return `${days} dias`;
}

/**
 * Formats an IDSS indicator value to exactly 4 decimal places.
 *
 * @param value - The indicator value
 * @returns Formatted string with exactly 4 decimal places
 */
export function formatIDSSValue(value: number): string {
  return value.toFixed(4);
}
