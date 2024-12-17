export interface Feedback {
  userId: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  feedbackText: string;
  rating: number;
  imageUrl: string | null;
  createdAt: Date;
}
