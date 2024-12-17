import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import { SessionService } from '../../services/session.service';
@Component({
  selector: 'app-e-ticket',
  standalone:false,
  templateUrl: './e-ticket.component.html',
  styleUrls: ['./e-ticket.component.css']
})
export class ETicketComponent implements OnInit {
  @ViewChild('ticketContainer', { static: false }) ticketContainer!: ElementRef;
  eventId!: string;
  userId!: string;
  userName!: string;
  event: any;
  userProfile: any;
  numberOfTickets!: number;
  gstRate: number = 18;
  baseCost: number = 0; // Base cost before GST
  gstAmount: number = 0; // GST amount
  totalCost: number = 0; // Total cost including GST
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private location: Location,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventid') || '';
      if (this.eventId) {
        this.fetchEventDetails(this.eventId); // Fetch profile if userId exists
      } else {
        console.error('No user ID found in route parameters');
      }
    });
    const retrievedId = this.sessionService.getItem('userId');
    if (retrievedId) {
      this.userId = retrievedId; 
        this.getUserProfile(this.userId); // Fetch profile if userId exists
      } else {
        console.error('No user ID found in route parameters');
        this.router.navigate(['/login']);
      }

  }
  getUserProfile(userId: string): void {
    this.authService.getProfileById(userId).subscribe(
      response => {
        this.userProfile = response;
        this.userName = response.fullName;
      },
      error => {
        console.error('Error fetching user profile', error);
        this.router.navigate(['/login']);
      }
    );
  }
  fetchEventDetails(eventId: string): void {
    const navigationState = history.state;

    // Set number of tickets from navigation state
    this.numberOfTickets = navigationState.tickets || 0;

    // Fetch event details
    this.authService.fetchEventDetails(eventId).subscribe(
      (response) => {
        this.event = response;
        console.log('Event details fetched:', this.event);
        console.log('Navigation State:', history.state);

        // Calculate total cost after fetching event details
        if (this.event && this.event.ticketPrice) {
          this.baseCost = this.numberOfTickets * this.event.ticketPrice;
          this.gstAmount = (this.baseCost * this.gstRate) / 100;
          this.totalCost = this.baseCost + this.gstAmount;
        }
      },
      (error) => {
        console.error('Error fetching event details:', error);
      }
    );
  }
  async downloadETicket() {
    if (!this.ticketContainer) {
      console.error('Ticket container not found!');
      return;
    }

    const element = this.ticketContainer.nativeElement;

    // Use html2canvas to capture only the ticket section
    const canvas = await html2canvas(element, { scale: 2 });
    const image = canvas.toDataURL('image/png');

    // Trigger download
    const link = document.createElement('a');
    link.href = image;
    link.download = `E-Ticket_${this.event.eventName}.png`;
    link.click();
  }
  viewBookings() {
    this.router.navigate([`/userdashboard`]);
  }
  onBack(): void {
    this.router.navigate([`/userdashboard`]);
  }
}
