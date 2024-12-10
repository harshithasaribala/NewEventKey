import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emprofile',
  standalone: false,
  
  templateUrl: './emprofile.component.html',
  styleUrl: './emprofile.component.css'
})
export class EmprofileComponent {
  em: any;
  Id: any;
  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    // Get user details from sessionStorage
    const profile = JSON.parse(sessionStorage.getItem('eventManager') || '{}');
    this.Id = sessionStorage.getItem('Id');
    this.em = profile;
  }

  updateProfile(): void {
    // Call the update API with the user ID and user data
    if (this.Id) {
      this.authService.updateUserProfile(this.Id, this.em).subscribe(
        (response) => {
          console.log('Profile updated successfully!', response);

          // After successful profile update, store updated data back in sessionStorage
          sessionStorage.setItem('eventManager', JSON.stringify(this.em));
          sessionStorage.setItem('Id', this.Id);  // Ensure the ID is also stored if changed
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
