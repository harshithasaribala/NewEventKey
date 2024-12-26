import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
@Component({
  selector: 'app-previous-bookings',
  standalone: false,
  
  templateUrl: './previous-bookings.component.html',
  styleUrl: './previous-bookings.component.css'
})
export class PreviousBookingsComponent implements OnInit {
  userId: string = '';
  bookings: any[] = [];

  constructor(
    private route: ActivatedRoute,private router:Router,
    private authService: AuthService,private sessionService:SessionService
  ) { }

  ngOnInit(): void {
    const retrievedId = this.sessionService.getItem('userId');
    if (retrievedId) {
      this.userId = retrievedId;
      if (this.userId) {
        this.fetchBookings(this.userId);
      } else {
        console.error('No user ID found in route parameters');
      }
    }
  }
  fetchBookings(userId: string): void {
    this.authService.getBookingsByUserId(userId).subscribe(
      (response) => {
        this.bookings = response;
        console.log('Bookings fetched:', this.bookings);
      },
      (error) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }
  
}
