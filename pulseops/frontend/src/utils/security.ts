export interface SanitizationResult {
  sanitized: string;
  wasSanitized: boolean;
  detectedThreats: string[];
}

/**
 * Strict Input Sanitization utility for XSS and malicious script neutralization
 */
export function sanitizeInput(input: string, maxLength: number = 200): SanitizationResult {
  const threats: string[] = [];
  let cleaned = input;

  // 1. Detect and flag script tags
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(cleaned)) {
    threats.push('Etiqueta <script> detectada');
    cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[SCRIPT_NEUTRALIZADO]');
  }

  // 2. Detect and flag javascript: pseudo-protocols
  if (/javascript:/gi.test(cleaned)) {
    threats.push('Protocolo javascript: detectado');
    cleaned = cleaned.replace(/javascript:/gi, 'blocked:');
  }

  // 3. Detect inline event handlers (onerror=, onload=, onclick=, etc.)
  if (/on\w+\s*=/gi.test(cleaned)) {
    threats.push('Event handler inline (onX=) detectado');
    cleaned = cleaned.replace(/on\w+\s*=/gi, 'blocked-attr=');
  }

  // 4. Strip any remaining HTML tags
  if (/<[^>]*>/g.test(cleaned)) {
    threats.push('Etiquetas HTML generales neutralizadas');
    cleaned = cleaned.replace(/<[^>]*>/g, '');
  }

  // 5. Escape HTML special characters
  const entityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  const entityEscaped = cleaned.replace(/[&<>"'/]/g, (s) => entityMap[s] || s);

  // 6. Strip non-printable control characters
  const normalized = entityEscaped
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();

  // 7. Limit length
  const finalResult = normalized.length > maxLength ? normalized.substring(0, maxLength) : normalized;

  const wasSanitized = threats.length > 0 || finalResult !== input.trim();

  return {
    sanitized: finalResult,
    wasSanitized,
    detectedThreats: threats,
  };
}
