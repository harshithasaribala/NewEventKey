import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  standalone: false,
  
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent {

  constructor(private adminService: AdminService, private router: Router) { }

  // Reset Events and Saved Events
  resetEvents() {
    this.adminService.deleteEvents().subscribe(
      () => {
        this.adminService.deleteSavedEvents().subscribe(
          () => {
            alert('Events and saved events have been successfully reset!');
          },
          (error) => {
            console.error('Error deleting saved events:', error);
            alert('An error occurred while resetting saved events.');
          }
        );
      },
      (error) => {
        console.error('Error deleting events:', error);
        alert('An error occurred while resetting events.');
      }
    );
  }

  // Reset Bookings
  resetBookings() {
    this.adminService.deleteBookings().subscribe(
      () => {
        alert('Bookings have been successfully reset!');
      },
      (error) => {
        console.error('Error deleting bookings:', error);
        alert('An error occurred while resetting bookings.');
      }
    );
  }

  // Reset Insights
  resetInsights() {
    this.adminService.deleteInsights().subscribe(
      () => {
        alert('Insights have been successfully reset!');
      },
      (error) => {
        console.error('Error deleting insights:', error);
        alert('An error occurred while resetting insights.');
      }
    );
  }

  // Method to cancel the reset action
  cancelReset() {
    this.router.navigate(['/admindashboard']);
  }
}
