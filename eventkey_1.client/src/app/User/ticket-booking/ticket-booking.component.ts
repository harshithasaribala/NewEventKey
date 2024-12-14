import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ticket-booking',
  standalone: false,
  templateUrl: './ticket-booking.component.html',
  styleUrls: ['./ticket-booking.component.css']
})
export class TicketBookingComponent implements OnInit {
  userId!: string;
  eventId!: string;
  userName: string = '';
  event: any;
  numberOfTickets: number = 1;
  totalCost: number = 0;
  userProfile: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.eventId = params.get('eventid') || '';
      if (this.eventId) {
        this.fetchEventDetails(this.eventId);
      } else {
        console.error('No event ID found in route parameters');
        this.router.navigate(['/login']);
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') || '';
      if (this.userId) {
        this.getUserProfile(this.userId);
      } else {
        console.error('No user ID found in route parameters');
        this.router.navigate(['/login']);
      }
    });
  }

  getUserProfile(userId: string): void {
    this.authService.getProfileById(userId).subscribe(
      (response) => {
        this.userProfile = response;
        this.userName = response.fullName;
      },
      (error) => {
        console.error('Error fetching user profile', error);
        this.router.navigate(['/login']);
      }
    );
  }

  fetchEventDetails(eventId: string): void {
    this.authService.fetchEventDetails(this.eventId).subscribe(
      (response) => {
        this.event = response;
        console.log('Event details fetched:', this.event);
        this.updateTotalCost();
      },
      (error) => {
        console.error('Error fetching event details:', error);
      }
    );
  }

  updateTotalCost() {
    // Calculate total cost dynamically based on the number of tickets
    this.totalCost = this.numberOfTickets * this.event.ticketPrice;
  }

  cancelBooking() {
    this.router.navigate([`/userdashboard/${this.userId}/eventdetails`]);
  }
  
  proceedToConfirm() {
    const bookingDetails = {
      userId: this.userId,
      eventId: this.eventId,
      numberOfTickets: this.numberOfTickets,
      totalAmount: this.totalCost,
      eventName: this.event.eventName,
      eventDate: this.event.eventDate,
      eventTime: this.event.eventTime,
      ticketPrice: this.event.ticketPrice,
      eventLocation: this.event.location,
      bookingDate: new Date().toISOString(),
    };

    // Call AuthService to save booking
    this.authService.saveBooking(bookingDetails).subscribe(
      (response: any) => {
        console.log(bookingDetails);
        alert('Booking saved successfully');

        // After saving, proceed to e-ticket generation
        this.router.navigate([`/userdashboard/${this.userId}/eventdetails/${this.eventId}/ticketbooking/eticket`], {
          state: { event: this.event, tickets: this.numberOfTickets },
        });
      },
      (error) => {
        console.log(bookingDetails);
        console.error('Error saving booking:', error);
        alert('Unable to save booking details. Please try again.');
      }
    );
  }

  onBack(): void {
    this.location.back();
  }
}
