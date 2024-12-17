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
  constructor(private eventService: AuthService, private router: Router,private route:ActivatedRoute,private location :Location,private sessionService:SessionService) { }

  ngOnInit() {
    const retrievedId = this.sessionService.getItem('userId');
    if (retrievedId) {
      this.userId = retrievedId;
    }
    this.eventService.fetchEvents().subscribe(
      (response) => {
        this.events = response;
        console.log('Events fetched successfully:', this.events);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  getEventImage(eventType: string): string {
    switch (eventType.toLowerCase()) {
      case 'conference':
        return 'assets/EventKey/assets/images/Events/Conference.jpg';
      case 'concert':
        return 'assets/EventKey/assets/images/Events/Concert.jpg';
      case 'workshop':
        return 'assets/EventKey/assets/images/Events/workshop.jpg';
      case 'comedy':
        return 'assets/EventKey/assets/images/Events/Comedy.jpg';
      case 'adventure':
        return 'assets/EventKey/assets/images/Events/Adventure.jpg';
      case 'foodfestival':
        return 'assets/EventKey/assets/images/Events/FoodFestival.jpg';
      case 'socialawarness':
        return 'assets/EventKey/assets/images/Events/SocialAwarness.jpg';
      case 'parks':
        return 'assets/EventKey/assets/images/Events/park.jpg';
      default:
        return 'assets/EventKey/assets/images/Events/default.png';
    }
  }

  bookTicket(event: any) {
    this.router.navigate([`/userdashboard/eventdetails/${event.eventId}/ticketbooking`]);
  }

  saveEvent(event: any): void {
    const eventPayload = {
      userId: this.userId,       // Assuming userId is available
      eventId: event.eventId     // Assuming event has the eventId
    };

    this.eventService.saveEvent(eventPayload).subscribe(
      (response) => {
        console.log('Event saved successfully:', response);
        alert(`Event ${event.eventName} has been saved successfully!`);
      },
      (error) => {
        console.log(eventPayload);
        console.error('Error saving event:', error);
        alert('An error occurred while saving the event. Please try again later.');
      }
    );
  }
}
