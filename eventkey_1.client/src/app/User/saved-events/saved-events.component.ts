import { Component,Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import { SessionService } from '../../services/session.service';
@Component({
  selector: 'app-saved-events',
  standalone: false,
  
  templateUrl: './saved-events.component.html',
  styleUrl: './saved-events.component.css'
})
export class SavedEventsComponent implements OnInit {
  @Input() events: any[] = [];
  savedEvents: any[] = [];
  userId!: string;
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private location: Location, private sessionService:SessionService) { }

  ngOnInit() {
    const retrievedId = this.sessionService.getItem('userId');
    if (retrievedId) {
      this.userId = retrievedId; 
        console.log('Fetched UserId');
      } else {
        console.error('No user ID found in route parameters');
        this.router.navigate(['/login']);
      }
    // Fetch saved events for the user
    this.authService.getSavedEvents(this.userId).subscribe(
      (response) => {
        this.savedEvents = response;
        console.log('Saved events fetched successfully:', this.savedEvents);
      },
      (error) => {
        console.error('Error fetching saved events:', error);
      }
    );
  }

  // Navigate to the ticket booking page for the selected event
  bookTicket(event: any) {
    this.router.navigate([`/userdashboard/eventdetails/${event.eventId}/ticketbooking`]);
  }

  // Remove the event from saved events
  removeEvent(eventId: string): void {
    this.authService.removeSavedEvent(this.userId, eventId).subscribe(
      () => {
        this.savedEvents = this.savedEvents.filter(event => event.eventId !== eventId);
        alert('Event removed successfully!');
      },
      (error) => {

        console.error('Error removing event:', error);
      }
    );
  }
}
