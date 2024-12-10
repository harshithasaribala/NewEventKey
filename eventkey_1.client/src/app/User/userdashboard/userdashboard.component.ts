import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HomeComponent } from '../../home/home.component';
import { AboutComponent } from '../../about/about.component';
import { Router } from '@angular/router';
import { UserProfileComponent } from '../userprofile/userprofile.component';
@Component({
  selector: 'app-userdashboard',
  standalone: false,
  
  templateUrl: './userdashboard.component.html',
  styleUrl: './userdashboard.component.css'
})
export class UserdashboardComponent implements OnInit{
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicComponentContainer!: ViewContainerRef;
  userName: string = '';
  isDropdownVisible: boolean = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private router: Router) { }

  ngOnInit() {
    const profile = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    this.userName = profile.fullName || 'User'; 
  }
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  logout() {
    sessionStorage.removeItem('userDetails'); // Clear specific user data
    sessionStorage.clear(); // Optional: Clears all session storage data
    this.router.navigate(['/login']);
  }
  loadComponent(section: string) {
    this.dynamicComponentContainer.clear(); // Clear existing components

    let componentToLoad;

    // Map sections to components
    switch (section) {
      case 'home':
        componentToLoad = HomeComponent;
        break;
      case 'about':
        componentToLoad = AboutComponent;
        break;
      case 'profile':
        componentToLoad = UserProfileComponent;
        this.router.navigate(['/userdashboard/profile']);
        break;
      case 'events_available':
        componentToLoad = null;
        break;
      case 'previous_bookings':
        componentToLoad = null;
        break;
      case 'saved_events':
        componentToLoad = null;
        break;
      default:
        componentToLoad = UserProfileComponent;
        this.router.navigate(['/userdashboard/profile']);      // Default fallback
    }
    
    if (componentToLoad) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        componentToLoad
      );
      this.dynamicComponentContainer.createComponent(componentFactory);
    }
  }
}

