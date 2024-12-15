// admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}
export interface RevenueData {
  totalRevenue: number;
  adminCommission: number;
  monthlyRevenue: MonthlyRevenue[];
}
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7172/api/Admin';
  private baseUrl = 'https://localhost:7172/api/Account';// Update with your API URL
  private bookingsUrl = 'https://localhost:7172/api/Bookings';
  constructor(private http: HttpClient) { }

  // Get Registered Users Count
  getRegisteredUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/RegisteredUsersCount`);
  }

  // Get Registered Event Managers Count
  getRegisteredEventManagersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/RegisteredEventManagersCount`);
  }
  getBookingInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/booking-info`);
  }
  getRevenueData(): Observable<RevenueData> {
    return this.http.get<RevenueData>(`${this.bookingsUrl}/revenue`);
  }
  getSalesData(managerId: string): Observable<any> {
    return this.http.get<any>(`${this.bookingsUrl}/salesData/${managerId}`);
  }
  getRevenueDatas(): Observable<any> {
    return this.http.get<any>(`${this.bookingsUrl}/revenueData`);
  }
  // Get all accounts by user type
  getAccounts(userType: string): Observable<any> {
    const params = new HttpParams().set('userType', userType);
    return this.http.get<any[]>(`${this.baseUrl}`, { params });
  }

  // Get account by ID
  getAccountById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Create account
  createAccount(account: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, account);
  }

  // Update account
  updateAccount(id: string, account: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, account);
  }

  // Delete account
  deleteAccount(id: string, userType: string): Observable<any> {
    const params = new HttpParams().set('userType', userType);
    return this.http.delete(`${this.baseUrl}/${id}`, { params });
  }
}
