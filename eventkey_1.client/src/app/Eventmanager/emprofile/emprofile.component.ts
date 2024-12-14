import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emprofile',
  standalone: false,
  templateUrl: './emprofile.component.html',
  styleUrls: ['./emprofile.component.css']
})
export class EmprofileComponent implements OnInit {
  em: any = {}; // Holds Event Manager profile data
  eid: string | null = null; // Event Manager ID

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Retrieve the Event Manager ID from sessionStorage
    this.eid = sessionStorage.getItem('eid');
    if (this.eid) {
      this.fetchProfile();
    } else {
      alert('Event Manager ID not found. Please log in again.');
    }
  }

  // Fetch profile data
  fetchProfile(): void {
    this.authService.getProfileById(this.eid!).subscribe({
      next: (profile) => {
        this.em = profile;
        console.log('Event Manager Profile:', profile);
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        alert('Unable to fetch profile details. Please try again.');
      },
    });
  }

  // Update profile
  updateProfile(): void {
    if (this.eid) {
      this.em.userType = 'EventManager';
      this.authService.updateProfileById(this.eid, this.em).subscribe({
        next: (response) => {
          console.error('Sucess:', response);
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
