import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7172/api/Account';
  private eventsUrl = 'https://localhost:7172/api/Events';

  constructor(private http: HttpClient) { }

  // Sign up method
  signUp(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
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
}
