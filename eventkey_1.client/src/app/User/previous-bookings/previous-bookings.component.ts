import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
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
    private authService: AuthService, private location:Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') || '';
      if (this.userId) {
        this.fetchBookings(this.userId);
      } else {
        console.error('No user ID found in route parameters');
      }
    });
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
  onBack(): void {
    this.location.back();
  }
  
}
