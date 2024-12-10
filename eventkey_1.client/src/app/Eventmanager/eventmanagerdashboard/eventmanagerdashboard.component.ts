import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HomeComponent } from '../../home/home.component';
import { AboutComponent } from '../../about/about.component';
import { EventcreationComponent } from '../eventcreation/eventcreation.component';
import { EmprofileComponent } from '../emprofile/emprofile.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventmanagerdashboard',
  standalone: false,
  
  templateUrl: './eventmanagerdashboard.component.html',
  styleUrl: './eventmanagerdashboard.component.css'
})
export class EventmanagerdashboardComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicComponentContainer!: ViewContainerRef;

  isDropdownVisible: boolean = false;
  showManageEventOptions: boolean = false;
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private router: Router) { }

  ngOnInit() {
    this.loadComponent('home');
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  loadComponent(section: string): void {
    // Clear the container before loading a new component
    this.dynamicComponentContainer.clear();
    if (section === 'manage_event') {
      this.showManageEventOptions = true;
      return; // Do not load any other component, just show the options
    }
    let componentToLoad;

    // Determine which component to load based on the section
    switch (section) {
      case 'home':
        componentToLoad = HomeComponent;
        break;
      case 'about':
        componentToLoad = AboutComponent;
        break;
      case 'create_event':
        componentToLoad = EventcreationComponent;
        this.router.navigate(['/eventmanagerdashboard/eventcreation']);
        break;
      case 'emprofile':
        componentToLoad = EmprofileComponent;
        this.router.navigate(['/eventmanagerdashboard/emprofile']);
        break;
      case 'edit_event':
        componentToLoad = null;
        break;
      case 'event_status':
        componentToLoad = null;
        break;
      case 'ticket_sales':
        componentToLoad = null;
        break;
      case 'logout':
        componentToLoad = HomeComponent;
        break;
      default:
        componentToLoad = EmprofileComponent;
        this.router.navigate(['/eventmanagerdashboard/emprofile']);
    }

    if (componentToLoad) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentToLoad);
      this.dynamicComponentContainer.createComponent(componentFactory);
      this.showManageEventOptions = false;
    }
  }
}
