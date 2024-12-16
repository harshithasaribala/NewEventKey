import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileComponent } from '../userprofile/userprofile.component';
import { AuthService } from '../../services/auth.service';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { SavedEventsComponent } from '../saved-events/saved-events.component';
import { SessionService } from '../../services/session.service';
import { PreviousBookingsComponent } from '../previous-bookings/previous-bookings.component';
import { FeedbackComponent } from '../../feedback/feedback.component';

@Component({
  selector: 'app-userdashboard',
  standalone:false,
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  userName: string = 'User'; 
  userProfile: any; // To store user profile details
  isDropdownVisible: boolean = false;
  userId: string = ''; // To store user ID from route parameter

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private userService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    const retrievedId = this.sessionService.getItem('userId');
    if (retrievedId) {
      this.userId = retrievedId;  // Assign only if it's not null
        this.getUserProfile(this.userId); // Fetch profile if userId exists
      } else {
        console.error('No user ID found in route parameters');
        this.router.navigate(['/login']);
      }
  }

  // Fetch user profile data
  getUserProfile(userId: string): void {
    this.userService.getProfileById(userId).subscribe(
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

  toggleDropdown() {
    // Toggle visibility of the dropdown menu
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  logout() {
    // Remove user details from session storage and redirect to login
    sessionStorage.removeItem('userDetails');
    sessionStorage.clear();
    this.sessionService.clear();
    this.router.navigate(['/login']);
  }

  loadComponent(section: string) {
    // Clear the current dynamic component and load the appropriate one
    this.dynamicComponentContainer.clear();
    if (section == 'profile') {
      this.loadUserProfile();
    }
    if (section == 'event_details') {
      this.loadEventDetails();
    }
    if (section == 'saved_events') {
      this.loadSavedEvents();
    }
    if (section == 'my_bookings') {
      this.loadSavedEvents();
    }
    //if (section == 'feedback') {
    //  this.loadFeedBack();
    //}
  }
  loadUserProfile() {
    // Dynamically load the user profile component
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UserProfileComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.user = this.userProfile; // Pass the profile data
  }
  loadEventDetails() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EventDetailsComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }
  loadSavedEvents() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SavedEventsComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }
  loadMyBookings() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PreviousBookingsComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }
  naviagteTOfeed() {
    this.router.navigate([`userdashboard/${this.userId}/feedback`]);
  }
  //loadFeedBack() {
  //  const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FeedbackComponent);
  //  const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  //}
}
