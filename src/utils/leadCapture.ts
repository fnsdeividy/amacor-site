import type { LeadCapture } from '../types';

const STORAGE_KEY = 'amacor_leads';

/**
 * Generates a UUID using crypto.randomUUID() with a fallback
 * for environments that don't support it.
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Creates a LeadCapture object with a unique ID and ISO timestamp.
 */
export function createLeadCapture(
  source: LeadCapture['source'],
  page: string,
  data: Record<string, string | number>,
  planContext?: string
): LeadCapture {
  const lead: LeadCapture = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    source,
    page,
    data,
  };

  if (planContext !== undefined) {
    lead.planContext = planContext;
  }

  return lead;
}

/**
 * Stores a LeadCapture in localStorage, appending to the existing array.
 * Acts as a mock for future CRM integration.
 */
export function storeLeadCapture(lead: LeadCapture): void {
  const existing = getStoredLeads();
  existing.push(lead);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

/**
 * Retrieves all stored LeadCapture entries from localStorage.
 */
export function getStoredLeads(): LeadCapture[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}
