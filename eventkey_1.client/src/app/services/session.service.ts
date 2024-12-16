import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // Set a value in session storage
  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  // Get a value from session storage
  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  // Remove an item from session storage
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Clear all session storage
  clear(): void {
    sessionStorage.clear();
  }
}
