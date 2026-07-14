export const BOOKING_NOTIFICATION_METADATA_KEY = 'iaf_booking_notification_sent';

export type BookingNotificationAudience = 'admin' | 'customer' | 'bundle';

export function hasSentBookingNotification(metadata: Record<string, string> | null | undefined): boolean {
  return metadata?.[BOOKING_NOTIFICATION_METADATA_KEY] === 'true';
}

export function bookingNotificationMetadata(eventId: string, sentAt = new Date().toISOString()): Record<string, string> {
  return {
    [BOOKING_NOTIFICATION_METADATA_KEY]: 'true',
    iaf_booking_notification_event_id: eventId,
    iaf_booking_notification_sent_at: sentAt,
  };
}

export function notificationIdempotencyKey(eventId: string, audience: BookingNotificationAudience): string {
  return `iaf-${eventId}-${audience}`;
}
