import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmprofileComponent } from '../emprofile/emprofile.component';
import { AuthService } from '../../services/auth.service'; // Assuming you have a service to fetch profile details
import { EventcreationComponent } from '../eventcreation/eventcreation.component';
import { SessionService } from '../../services/session.service';
import { ManageEventsComponent } from '../manage-events/manage-events.component';
import { TicketSalesComponent } from '../ticket-sales/ticket-sales.component';
import { EventPromotionComponent } from '../event-promotion/event-promotion.component';


@Component({
  selector: 'app-eventmanagerdashboard',
  standalone: false,
  templateUrl: './eventmanagerdashboard.component.html',
  styleUrls: ['./eventmanagerdashboard.component.css']
})
export class EventmanagerdashboardComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  eventManagerName: string = ''; // Default name until we fetch the profile
  eventManagerProfile: any; // To store event manager profile details
  events: any[] = []; // Store list of events
  isDropdownVisible: boolean = false;
  eventManagerId: string = ''; // To store event manager ID from route parameter
  showManageEventOptions: boolean = false;
  eventId: string = '';
  activeView: string = 'eventList';

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService, // Assuming you have a service for profile data
    private router: Router,
    private route: ActivatedRoute,
    private sessionService:SessionService
  ) { }

  ngOnInit(): void {
    // Fetch eventManagerId from route parameters
    const retrievedId = this.sessionService.getItem('eid');
    if (retrievedId) {
      this.eventManagerId = retrievedId;  // Assign only if it's not null
      if (this.eventManagerId) {
        this.getEventManagerProfile(this.eventManagerId); // Fetch profile if eventManagerId exists
        this.getEventsByManagerId(this.eventManagerId); // Fetch events
      } else {
        console.error('No event manager ID found in route parameters');
        this.router.navigate(['/login']);
      }
    }
  }

  // Fetch event manager profile data
  getEventManagerProfile(eventManagerId: string): void {
    this.authService.getProfileById(eventManagerId).subscribe(
      response => {
        this.eventManagerProfile = response;
        console.log(response);
        this.eventManagerName = response.fullName; // Set eventManagerName based on profile data
        console.log(this.eventManagerName);
      },
      error => {
        console.error('Error fetching event manager profile', error);
        this.router.navigate(['/login']);
      }
    );
  }

  // Fetch events by event manager ID
  getEventsByManagerId(eventManagerId: string): void {
    this.authService.getEventsByManagerId(eventManagerId).subscribe(
      response => {
        this.events = response;
        console.log('Events:', this.events);
      },
      error => {
        console.error('Error fetching events', error);
      }
    );
  }

  // Toggle manage event options
  toggleManageEventOptions() {
    this.showManageEventOptions = !this.showManageEventOptions;
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
    this.dynamicComponentContainer.clear();
    this.activeView = section;
    switch (section) {
      case 'home':
        this.activeView = 'eventList';
        break;
      case 'emprofile':
        this.loadEventManagerProfile();
        break;
      case 'create':
        this.loadEventCreation();
        break;
      case 'manage':
        this.loadManageEvents();
        break;
      case 'sales':
        this.loadSales();
        break;
      case 'promote':
        this.loadPromote();
        break;
      default:
        console.warn('Unknown section:', section);
    }
  }

  loadEventCreation() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EventcreationComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }
 loadSales() {
   const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TicketSalesComponent);
   const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }
  loadPromote() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EventPromotionComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }

  loadEventManagerProfile() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EmprofileComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.em = this.eventManagerProfile; // Pass the profile data
  }

  loadManageEvents() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ManageEventsComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }
}
