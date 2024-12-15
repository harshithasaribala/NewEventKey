import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-admindashboard',
  standalone: false,
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
})
export class AdmindashboardComponent implements OnInit {
  // Data for charts
  registeredUsersCount!: number;
  eventManagersCount!: number;

  constructor(private router: Router, private adminService: AdminService) {
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
  navigateToRevenue() {
    this.router.navigate(['/admindashboard/revenue-visualization']);
  }
  navigateToAccounts() {
    this.router.navigate(['/admindashboard/manage-accounts']);
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


  logout() {
    this.router.navigate(['/adminlogin']);
  }
}
