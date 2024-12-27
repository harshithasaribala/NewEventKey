import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-event-booking-insights',
  standalone: false,
  
  templateUrl: './event-booking-insights.component.html',
  styleUrl: './event-booking-insights.component.css'
})
export class EventBookingInsightsComponent implements OnInit{
  userId: string = '';
  totalBookings: number = 0;
  totalRewards: number = 0;
  userRank: string = '-';
  leaderboard: Array<{ rank: number; userId: string; totalPoints: number }> = [];
  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) { }
  ngOnInit(): void {
    const retrievedId = this.sessionService.getItem('userId');
    if (retrievedId) {
      this.userId = retrievedId;
      this.fetchUserInsights();
      this.fetchLeaderboard();
    } else {
      console.error('No user ID found in route parameters');
      this.router.navigate(['/login']);
    }
  }
  fetchUserInsights(): void {
    this.adminService.getUserInsightsById(this.userId).subscribe(
      (response) => {
        this.totalBookings = response.totalBookings;
        this.totalRewards = response.totalPoints;
        this.userRank = response.rank;
        console.log('User insights fetched successfully:', response);
      },
      (error) => {
        console.error('Error fetching user insights:', error);
      }
    );
  }
  fetchLeaderboard(): void {
    this.adminService.getUserInsightsTop().subscribe(
      (response) => {
        this.leaderboard = response.slice(0, 5); // Limit to top 5 users
        console.log('Leaderboard fetched successfully:', this.leaderboard);
      },
      (error) => {
        console.error('Error fetching leaderboard:', error);
      }
    );
  }
  NavigateToPlay() {
    this.router.navigate(['userdashboard/ticket-catcher']);
  }
  NavigateToPlayMem() {
    this.router.navigate(['userdashboard/memory-matcher']);
  }
}
