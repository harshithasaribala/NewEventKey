import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../feedback/feedback.model';

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface RevenuePerEvent {
  eventId: string; 
  revenue: number;
}

export interface RevenueData {
  totalRevenue: number;
  adminCommission: number;
  averageRevenuePerEvent: number;
  revenuePerEvent: RevenuePerEvent[]; // Updated to reflect new API structure
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://13.61.12.27:5000/api/Admin';
  private baseUrl = 'http://13.61.12.27:5000/api/Account'; 
  private bookingsUrl = 'http://13.61.12.27:5000/api/Bookings';
  private feedbackUrl = 'http://13.61.12.27:5000/api/Feedback';
  private mailUrl = 'http://13.61.12.27:5000/api/Promotion/send';
  private insightsUrl = 'http://13.61.12.27:5000/api/UserInsights';
  private eventsUrl = 'http://13.61.12.27:5000/api/Events';
  constructor(private http: HttpClient) { }

  // Feedback Management
  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.feedbackUrl);
  }

  deleteFeedback(eventId: string): Observable<any> {
    return this.http.delete(`${this.feedbackUrl}/Event/${eventId}`);
  }

  // Get Registered Users Count
  getRegisteredUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/RegisteredUsersCount`);
  }

  // Get Registered Event Managers Count
  getRegisteredEventManagersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/RegisteredEventManagersCount`);
  }

  // Get Booking Information
  getBookingInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/booking-info`);
  }

  // Fetch Revenue Data (Updated for new fields)
  getRevenueData(): Observable<RevenueData> {
    return this.http.get<RevenueData>(`${this.bookingsUrl}/revenue`);
  }

  // Get Sales Data by Manager ID
  getSalesData(managerId: string): Observable<any> {
    return this.http.get<any>(`${this.bookingsUrl}/salesData/${managerId}`);
  }

  // User Accounts Management
  getAccounts(userType: string): Observable<any> {
    const params = new HttpParams().set('userType', userType);
    return this.http.get<any[]>(`${this.baseUrl}`, { params });
  }

  getAccountById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createAccount(account: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, account);
  }

  updateAccount(id: string, account: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, account);
  }

  deleteAccount(id: string, userType: string): Observable<any> {
    const params = new HttpParams().set('userType', userType);
    return this.http.delete(`${this.baseUrl}/${id}`, { params });
  }
  sendPromotionEmail(request: { subject: string, body: string, recipients: string[] }): Observable<any> {
    return this.http.post(this.mailUrl, request);
  }
  getUserInsightsById(userId: string): Observable<any> {
    const url = `${this.insightsUrl}/${userId}`;
    return this.http.get<any>(url);
  }
  getUserInsightsTop(): Observable<any[]> {
    return this.http.get<any[]>(this.insightsUrl);
  }
  deleteEvents(): Observable<any[]> {
    return this.http.delete<any[]>(`${this.eventsUrl}/delete-all`);
  }
  deleteSavedEvents(): Observable<any[]> {
    return this.http.delete<any[]>(`${this.eventsUrl}/delete-all-saved`);
  }
  deleteBookings(): Observable<any[]> {
    return this.http.delete<any[]>(`${this.bookingsUrl}/delete-all`);
  }
  deleteInsights(): Observable<any[]> {
    return this.http.delete<any[]>(this.insightsUrl);
  }
}
