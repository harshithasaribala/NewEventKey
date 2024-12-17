import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Event } from './event.model';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Home Page';
  events: Event[] = [];
  feedbacks: any[] = [];  
  topFeedbacks: any[] = []; 
 
  constructor(private eventService: AuthService, private router: Router, private adminService:AdminService) { }

  ngOnInit(): void {
    this.eventService.getUpcomingEvents().subscribe(
      (data: Event[]) => {
        console.log(data);  // Log the response to ensure the data structure is as expected
        this.events = data;
      },
      (error) => console.error(error)
    );
    this.adminService.getAllFeedbacks().subscribe(
      (data) => {
        this.feedbacks = data; // Store all feedbacks
        this.topFeedbacks = this.getTopFeedbacks(2); // Get top 2 feedbacks based on rating
      },
      (error) => {
        console.error('Error fetching feedback:', error);
      }
    );
  }
getTopFeedbacks(count: number): any[] {
  // Sort feedbacks by rating in descending order
  const sortedFeedbacks = this.feedbacks.sort((a, b) => b.rating - a.rating);
  return sortedFeedbacks.slice(0, count); // Get the first 'count' feedbacks
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
  bookNow(): void {
    this.router.navigate(['/login']);
  }
}
