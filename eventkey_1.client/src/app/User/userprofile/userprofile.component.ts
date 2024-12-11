import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userprofile',
  standalone: false,
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: any = {}; // Holds User profile data
  userId: string | null = null; // User ID

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Retrieve the User ID from sessionStorage
    this.userId = sessionStorage.getItem('userId');
    if (this.userId) {
      this.fetchProfile();
    } else {
      alert('User ID not found. Please log in again.');
    }
  }

  // Fetch profile data
  fetchProfile(): void {
    this.authService.getProfileById(this.userId!).subscribe({
      next: (profile) => {
        this.user = profile;
        console.log('User Profile:', profile);
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        alert('Unable to fetch profile details. Please try again.');
      },
    });
  }

  // Update profile
  updateProfile(): void {
    if (this.userId) {
      this.user.userType = 'User';
      this.authService.updateProfileById(this.userId, this.user).subscribe({
        next: (response) => {
          alert('Profile updated successfully!');
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          alert('Unable to update profile. Please try again.');
        },
      });
    }
  }
}
