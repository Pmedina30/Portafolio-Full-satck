import { AuditLogEntry } from '../types/finpulse';

export const DEMO_PIN = '4492';

/**
 * Computes a standard SHA-256 hash string from text
 */
export async function computeSha256(text: string): Promise<string> {
  try {
    if (window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('SubtleCrypto error, falling back to simulated hash', err);
  }

  // Fallback hash implementation if WebCrypto is unavailable
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}e9bf439a2f1837c0de10${hex.slice(0, 4)}da9928174620aa`;
}

/**
 * Masks bank account or card number
 */
export function maskAccountNumber(acc: string, isMasked: boolean): string {
  if (!isMasked) return acc;
  const parts = acc.split('-');
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    return `••••-••••-${lastPart}`;
  }
  return `••••-••••-${acc.slice(-4)}`;
}

/**
 * Masks monetary amounts for audit confidentiality
 */
export function formatFintechAmount(amount: number, isMasked: boolean): string {
  if (isMasked) {
    return 'US$ **,***.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Masks employee name
 */
export function maskEmployeeName(name: string, isMasked: boolean): string {
  if (!isMasked) return name;
  const parts = name.split(' ');
  return parts
    .map((p) => (p.length > 1 ? `${p[0]}${'•'.repeat(Math.min(5, p.length - 1))}` : p))
    .join(' ');
}

/**
 * Generates initial genesis audit trail
 */
export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'LOG-0001',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    actor: 'System Initialization Daemon',
    action: 'INJECT_TEST',
    details: 'Ledger initialized with 30 enterprise baseline transactions and baseline distributions',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'LOG-0002',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    actor: 'Auto-Statistical Sentinel',
    action: 'FREEZE_TX',
    transactionId: 'TX-2026-1042',
    details: 'Flagged transaction TX-2026-1042 ($14,850.00 in Meals & Entertainment) with Z-Score +4.82σ',
    previousHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  },
  {
    id: 'LOG-0003',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    actor: 'Compliance Auditor (SecOps)',
    action: 'MASK_DATA',
    details: 'Enforced Zero-Knowledge data masking on sensitive employee accounts and card numbers',
    previousHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
  },
];
