import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileComponent } from '../userprofile/userprofile.component';
import { AuthService } from '../../services/auth.service';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { SavedEventsComponent } from '../saved-events/saved-events.component';

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
    private route: ActivatedRoute // To access route parameters
  ) { }

  ngOnInit(): void {
    // Fetch userId from route parameters
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId') || '';
      if (this.userId) {
        this.getUserProfile(this.userId); // Fetch profile if userId exists
      } else {
        console.error('No user ID found in route parameters');
        this.router.navigate(['/login']);
      }
    });
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
    this.router.navigate(['/login']);
  }

  loadComponent(section: string) {
    // Clear the current dynamic component and load the appropriate one
    this.dynamicComponentContainer.clear();
    if (section == 'profile') {
      this.loadUserProfile();
    }
  }
  navigateToEventDetails() {
    // Navigate to the event details page with the current user ID
    this.router.navigate([`/userdashboard/${this.userId}/eventdetails`]);
  }
  loadUserProfile() {
    // Dynamically load the user profile component
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UserProfileComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.user = this.userProfile; // Pass the profile data
  }
  navigateToSavedEvents() {
    this.router.navigate([`/userdashboard/${this.userId}/savedEvents`]);
  }
  navigateToMyBookings() {
    this.router.navigate([`/userdashboard/${this.userId}/previousBookings`]);
  }
}
