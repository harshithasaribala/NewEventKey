import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmprofileComponent } from '../emprofile/emprofile.component';
import { AuthService } from '../../services/auth.service'; // Assuming you have a service to fetch profile details
import { EventcreationComponent } from '../eventcreation/eventcreation.component';

@Component({
  selector: 'app-eventmanagerdashboard',
  standalone: false,
  templateUrl: './eventmanagerdashboard.component.html',
  styleUrls: ['./eventmanagerdashboard.component.css']
})
export class EventmanagerdashboardComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  eventManagerName: string = 'Event Manager'; // Default name until we fetch the profile
  eventManagerProfile: any; // To store event manager profile details
  isDropdownVisible: boolean = false;
  eventManagerId: string = ''; // To store event manager ID from route parameter
  showManageEventOptions: boolean = false;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService, // Assuming you have a service for profile data
    private router: Router,
    private route: ActivatedRoute // To access route parameters
  ) { }

  ngOnInit(): void {
    // Fetch eventManagerId from route parameters
    this.route.paramMap.subscribe(params => {
      this.eventManagerId = params.get('eid') || '';
      if (this.eventManagerId) {
        this.getEventManagerProfile(this.eventManagerId); // Fetch profile if eventManagerId exists
      } else {
        console.error('No event manager ID found in route parameters');
        this.router.navigate(['/login']);
      }
    });
  }
  toggleManageEventOptions() {
    this.showManageEventOptions = !this.showManageEventOptions;
  }
  // Fetch event manager profile data
  getEventManagerProfile(eventManagerId: string): void {
    this.authService.getProfileById(eventManagerId).subscribe(
      response => {
        this.eventManagerProfile = response;
        this.eventManagerName = this.eventManagerProfile.name || 'Event Manager'; // Set eventManagerName based on profile data
      },
      error => {
        console.error('Error fetching event manager profile', error);
        this.router.navigate(['/login']);
      }
    );
  }

  toggleDropdown() {
    // Toggle visibility of the dropdown menu
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  logout() {
    // Remove event manager details from session storage and redirect to login
    sessionStorage.removeItem('eventManagerDetails');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  loadComponent(section: string) {
    // Clear the current dynamic component and load the appropriate one
    this.dynamicComponentContainer.clear();
    if (section === 'emprofile') {
      this.loadEventManagerProfile();
    }
    if (section === 'createEvent') {
      this.loadEventCreationComponent();
    }
  }
  loadEventCreationComponent() {
    // Dynamically load the event creation component
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EventcreationComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);

    // Pass event manager's id and email to the component
    componentRef.instance.emId = this.eventManagerId; // Pass the event manager id or create an eid
    componentRef.instance.email = this.eventManagerProfile?.email || ''; // Pass email from the profile
  }
  loadEventManagerProfile() {
    // Dynamically load the event manager profile component
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EmprofileComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.em = this.eventManagerProfile; // Pass the profile data
  }
}
