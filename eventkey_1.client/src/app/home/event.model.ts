export interface Event {
  eventId: string;
  eventName: string;
  eventDate: Date;
  eventTime: string;
  location: string;
  description: string;
  eventType: string; // Add this property if it doesn't exist
}
