/**
 * Security event logging service.
 *
 * Every time a security control blocks or detects something
 * (RCE command, SSRF URL, prototype pollution, rate limit hit,
 *  failed auth, etc.), record it here for audit and compliance.
 */

import crypto from "crypto";
import { logger } from "../_core/logger";

export type SecurityEventType =
  | "rce_command_blocked"
  | "ssrf_url_blocked"
  | "prototype_pollution_blocked"
  | "rate_limit_hit"
  | "auth_failure"
  | "csrf_failure"
  | "password_reset_attempt"
  | "mcp_registration_rate_limited"
  | "collection_data_size_exceeded"
  | "webhook_delivery_dead_letter";

export interface SecurityEvent {
  id: string;
  eventType: SecurityEventType;
  userId?: number;
  ip?: string;
  userAgent?: string;
  details: Record<string, unknown>;
  createdAt: Date;
}

// In-memory buffer — in production this should flush to DB
const eventBuffer: SecurityEvent[] = [];
const MAX_BUFFER_SIZE = 10_000;

/**
 * Log a security event. Best-effort: never throws.
 * In production, wire this to a dedicated `security_events` table.
 */
export function logSecurityEvent(
  eventType: SecurityEventType,
  details: Record<string, unknown> = {},
  meta?: { userId?: number; ip?: string; userAgent?: string },
): void {
  const event: SecurityEvent = {
    id: crypto.randomUUID(),
    eventType,
    userId: meta?.userId,
    ip: meta?.ip,
    userAgent: meta?.userAgent,
    details,
    createdAt: new Date(),
  };

  // Log to application logs for immediate visibility
  logger.warn(
    {
      eventType,
      userId: meta?.userId,
      ip: meta?.ip,
      details,
    },
    `[Security] ${eventType}`,
  );

  // Buffer for batch persistence
  eventBuffer.push(event);
  if (eventBuffer.length > MAX_BUFFER_SIZE) {
    eventBuffer.shift(); // drop oldest to prevent unbounded growth
  }
}

/** Get recent security events for dashboard/admin review */
export function getRecentSecurityEvents(limit = 100): SecurityEvent[] {
  return eventBuffer.slice(-limit).reverse();
}

/** Count events by type in the last N hours (for alerting) */
export function countSecurityEvents(eventType: SecurityEventType, windowHours = 1): number {
  const cutoff = Date.now() - windowHours * 60 * 60 * 1000;
  return eventBuffer.filter((e) => e.eventType === eventType && e.createdAt.getTime() >= cutoff)
    .length;
}

/** Flush buffer — call on shutdown or periodically */
export function flushSecurityEvents(): SecurityEvent[] {
  const flushed = [...eventBuffer];
  eventBuffer.length = 0;
  return flushed;
}
