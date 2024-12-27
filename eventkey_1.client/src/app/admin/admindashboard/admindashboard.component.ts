import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import {
  Chart,
  DoughnutController,
  BarController,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from 'chart.js';
import { ManageAccountsComponent } from '../manage-accounts/manage-accounts.component';
import { RevenueVisualizationComponent } from '../revenue-visualization/revenue-visualization.component';
import { ViewFeedbackComponent } from '../view-feedback/view-feedback.component';
import { PromotionComponent } from '../promotion/promotion.component';

@Component({
  selector: 'app-admindashboard',
  standalone: false,
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
})
export class AdmindashboardComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  registeredUsersCount!: number;
  eventManagersCount!: number;
  activeView: string = 'charts';
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private router: Router, private adminService: AdminService) {
    // Register the required Chart.js components
    Chart.register(
      DoughnutController,
      BarController,
      ArcElement,
      Tooltip,
      Legend,
      CategoryScale,
      LinearScale,
      Title
    );
  }
  loadComponent(section: string) {
    this.dynamicComponentContainer.clear();
    this.activeView = section;
    switch (section) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'feedback':
        this.loadViewFeedback();
        break;
      case 'accounts':
        this.loadManageAccounts();
        break;
      case 'revenue':
        this.loadRevenue();
        break;
      case 'promote':
        this.loadPromotion();
        break;
      default:
        console.warn('Unknown section:', section);
    }
  }
  loadViewFeedback() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ViewFeedbackComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }
  loadManageAccounts() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ManageAccountsComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }
  loadRevenue() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(RevenueVisualizationComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }
  loadPromotion() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PromotionComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
  }
  ngOnInit(): void {
    this.fetchRegisteredUsersCount();
    this.fetchEventManagersCount();
  }

  // Fetch Registered Users Count
  fetchRegisteredUsersCount() {
    this.adminService.getRegisteredUsersCount().subscribe((data) => {
      this.registeredUsersCount = data;
      this.createRegisteredUsersChart();
    });
  }

  // Fetch Registered Event Managers Count
  fetchEventManagersCount() {
    this.adminService.getRegisteredEventManagersCount().subscribe((data) => {
      this.eventManagersCount = data;
      this.createEventManagersChart();
    });
  }


  // Chart for Registered Users Count
  createRegisteredUsersChart() {
    new Chart('registeredUsersChart', {
      type: 'doughnut',
      data: {
        labels: ['Registered Users'],
        datasets: [
          {
            data: [this.registeredUsersCount],
            backgroundColor: ['#FF6F61'],
            hoverBackgroundColor: ['#FF5733'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  }

  // Chart for Registered Event Managers Count
  createEventManagersChart() {
    new Chart('eventManagersChart', {
      type: 'doughnut',
      data: {
        labels: ['Registered Event Managers'],
        datasets: [
          {
            data: [this.eventManagersCount],
            backgroundColor: ['#36A2EB'],
            hoverBackgroundColor: ['#1E90FF'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  }
  reboot() {

  }

  logout() {
    this.router.navigate(['/adminlogin']);
  }
}
