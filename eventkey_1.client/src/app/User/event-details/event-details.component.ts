import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-event-details',
  standalone: false,
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  @Input() events: any[] = [];
  userId!: string;
  filteredEvents: any[] = [];
  searchTerm: string = '';

  constructor(
    private eventService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    const retrievedId = this.sessionService.getItem('userId');
    if (retrievedId) {
      this.userId = retrievedId;
    }

    this.eventService.fetchEvents().subscribe(
      (response) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Reset time to start of the day
        this.events = response.filter((event: any) => new Date(event.eventDate) >= currentDate);
        this.filteredEvents = [...this.events]; // Initialize with all valid events
        console.log('Events fetched successfully:', this.events);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  getEventImage(eventType: string): string {
    switch (eventType) {
      case 'Conference':
        return 'assets/EventKey/assets/images/Events/Conference.jpg';
      case 'Concert':
        return 'assets/EventKey/assets/images/Events/Concert.jpg';
      case 'Sports':
        return 'assets/EventKey/assets/images/Events/Sports.png';
      case 'Workshop':
        return 'assets/EventKey/assets/images/Events/workshop.jpg';
      case 'Comedy':
        return 'assets/EventKey/assets/images/Events/Comedy.jpg';
      case 'Adventure':
        return 'assets/EventKey/assets/images/Events/Adventure.jpg';
      case 'Food Festival':
        return 'assets/EventKey/assets/images/Events/FoodFestival.jpg';
      case 'Social Awareness':
        return 'assets/EventKey/assets/images/Events/SocialAwarness.jpg';
      case 'Parks':
        return 'assets/EventKey/assets/images/Events/park.jpg';
      default:
        return 'assets/EventKey/assets/images/Events/default.jpg';
    }
  }

  bookTicket(event: any) {
    this.router.navigate([`/userdashboard/eventdetails/${event.eventId}/ticketbooking`]);
  }

  searchEvents() {
    const searchTermLower = this.searchTerm.trim().toLowerCase();
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to start of the day

    if (!searchTermLower) {
      // If no search term, display events with dates from today onwards
      this.filteredEvents = this.events.filter(event =>
        new Date(event.eventDate) >= currentDate
      );
    } else {
      // Filter events based on search term (by name or type) and valid dates
      this.filteredEvents = this.events.filter(event =>
        (event.eventName?.toLowerCase().includes(searchTermLower) ||
          event.eventType?.toLowerCase().includes(searchTermLower)) &&
        new Date(event.eventDate) >= currentDate
      );
    }

    console.log('Filtered events:', this.filteredEvents);
  }

  saveEvent(event: any): void {
    const eventPayload = {
      userId: this.userId,
      eventId: event.eventId
    };

    this.eventService.saveEvent(eventPayload).subscribe(
      (response) => {
        alert('Event saved successfully');
        console.log('Event saved successfully:', response);
      },
      (error) => {
        console.error('Error saving event:', error);
      }
    );
  }
}
