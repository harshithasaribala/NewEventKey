import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userprofile',
  standalone: false,
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css'
})
export class UserProfileComponent {
  user: any;
  userId: any;
  constructor(private authService: AuthService,private router:Router) { }
  ngOnInit(): void {
    // Get user details from sessionStorage
    const profile = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    this.userId = sessionStorage.getItem('userId');
    this.user = profile;
  }

  updateProfile(): void {
    // Call the update API with the user ID and user data
    if (this.userId) {
      this.authService.updateUserProfile(this.userId, this.user).subscribe(
        (response) => {
          console.log('Profile updated successfully!', response);

          // After successful profile update, store updated data back in sessionStorage
          sessionStorage.setItem('userDetails', JSON.stringify(this.user));
          sessionStorage.setItem('userId', this.userId);  // Ensure the ID is also stored if changed
          alert('Profile updated successfully!');
        },
        (error) => {
          console.error('Error updating profile:', error);
          alert('Error updating profile. Please try again later.');
        }
      );
    }
  }
}
