import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../home/event.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://13.61.12.27:5000/api/Account';
  private eventsUrl = 'http://13.61.12.27:5000/api/Events';
  private bookingsUrl = 'http://13.61.12.27:5000/api/Bookings';
  private feedBackUrl = 'http://13.61.12.27:5000/api/Feedback';
  constructor(private http: HttpClient) { }

  // Sign up method
  signUp(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }
  checkUserExistence(email: string, phoneNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-user`, {
      params: { email, phoneNumber }
    });
  }
  // Login method
  login(credentials: { userType: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Create Event method
  createEvent(eventData: any): Observable<any> {
    return this.http.post<any>(this.eventsUrl, eventData);
  }

  // Get Profile by ID
  getProfileById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Update Profile by ID
  updateProfileById(id: string, profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, profileData);
  }
  fetchEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.eventsUrl);
  }
  fetchEventDetails(eventId: string): Observable<any> {
    return this.http.get(`${this.eventsUrl}/${eventId}`);
  }
  getEventsByManagerId(eventManagerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.eventsUrl}/by-emId/${eventManagerId}`);
  }
  registerTickets(eventId: string, numberOfTickets: number) {
    const payload = { eventId, numberOfTickets };
    return this.http.post(`${this.eventsUrl}/register`, payload);
  }
  saveEvent(eventPayload: { userId: string, eventId: string }): Observable<any> {
    return this.http.post(`${this.eventsUrl}/save`, eventPayload);
  }
  getSavedEvents(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.eventsUrl}/saved/${userId}`);
  }
  removeSavedEvent(userId: string, eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.eventsUrl}/saved/${userId}/${eventId}`);
  }
  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.eventsUrl}/upcoming`);
  }
  saveBooking(bookingDetails: any): Observable<any> {
    return this.http.post(`${this.bookingsUrl}`, bookingDetails);
  }
  getBookingsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.bookingsUrl}/byUserId/${userId}`);
  }
  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${this.eventsUrl}/${eventId}`);
  }
  updateEvent(eventId: string, eventData: any) {
    return this.http.put(`${this.eventsUrl}/${eventId}`, eventData);
  }
  submitFeedback(feedbackData: any): Observable<any> {
    console.log(`${this.feedBackUrl}`, feedbackData);
    return this.http.post(`${this.feedBackUrl}`, feedbackData);
  }
}
