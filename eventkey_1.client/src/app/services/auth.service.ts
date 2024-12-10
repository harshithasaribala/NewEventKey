import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signUpUrl = 'https://localhost:7172/api/Account'; // Replace with your actual API URL
  private loginUrl = 'https://localhost:7172/api/Account/login';
  private profileUrl = 'https://localhost:7172/api/Account';
  private createEventurl = 'https://localhost:7172/api/Events';
  private profile: any;
  constructor(private http: HttpClient, private router: Router) { }

  // Sign up method
  signUp(userData: any): Observable<any> {
    return this.http.post(this.signUpUrl, userData);
  }
  login(credentials: { userType: string; email: string; password: string; }): Observable<any> {
    return this.http.post(this.loginUrl, credentials);
  }
  createEvent(eventData: any): Observable<any> {
    return this.http.post<any>(this.createEventurl, eventData);
  }
  setProfile(profileData: any): void {
    this.profile = profileData;
  }

  getProfile(): any {
    return this.profile || JSON.parse(localStorage.getItem('profile') || '{}');
  }

  updateUserProfile(userId: any, user: any): Observable<any> {
    return this.http.put(`${this.profileUrl}/${userId}`, user);
  }

}

