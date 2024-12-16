import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
@Component({
  selector: 'app-manage-events',
  standalone: false,
  
  templateUrl: './manage-events.component.html',
  styleUrl: './manage-events.component.css'
})
export class ManageEventsComponent implements OnInit {
  @Input() events: any[] = []; // Stores the list of events
  eventManagerId: string | null = null; // Stores the event manager ID
  eventId!: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute, // For extracting route parameters
    private location: Location,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {

    const retrievedId = this.sessionService.getItem('eid');
    if (retrievedId) {
      this.eventManagerId = retrievedId;
    }
      console.log(`Event Manager ID: ${this.eventManagerId}`);
      if (this.eventManagerId) {
        this.fetchEventDetails(this.eventManagerId);
      }
    }

  fetchEventDetails(eventmanagerId: string): void {
    this.authService.getEventsByManagerId(eventmanagerId).subscribe(
      (events: any[]) => {
        this.events = events;
        console.log(events);
      },
      (error) => {
        console.error('Error fetching events', error);
      }
    );
  }

  navigateToEditEvent(eventId: string): void {
    if (this.eventManagerId) {
      // Navigate to the edit event page with eventmanagerId and eventId in the route
      this.router.navigate([`eventmanagerdashboard/manageEvents/${eventId}/editEvent`]);
    }
  }

  deleteEvent(eventId: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.authService.deleteEvent(eventId).subscribe(
        () => {
          // Remove the deleted event from the list
          this.events = this.events.filter(event => event.eventId !== eventId);
          console.log('Event deleted successfully');
          alert('Event Deleted');
        },
        (error) => {
          console.error('Error deleting event', error);
        }
      );
    }
  }

  goBack(): void {
    this.location.back(); // Navigate to the previous route
  }
}
