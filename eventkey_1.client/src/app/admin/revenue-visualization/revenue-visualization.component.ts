import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import {
  Chart,
  BarController,
  PieController,
  LineController,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  ArcElement, // for pie chart
  BarElement // for bar chart
} from 'chart.js';

@Component({
  selector: 'app-revenue-visualization',
  standalone: false,
  templateUrl: './revenue-visualization.component.html',
  styleUrl: './revenue-visualization.component.css'
})
export class RevenueVisualizationComponent implements OnInit {
  totalRevenue: number = 0;
  adminCommission: number = 0;
  averageRevenuePerEvent: number = 0;
  revenuePerEvent: { eventId: string; revenue: number }[] = [];

  constructor(private adminService: AdminService) {
    // Register the necessary controllers and elements
    Chart.register(
      BarController,
      PieController,
      LineController,
      Tooltip,
      Legend,
      CategoryScale,
      LinearScale,
      Title,
      ArcElement, // For Pie Chart
      BarElement // For Bar Chart
    );
  }

  ngOnInit(): void {
    this.fetchRevenueData();
  }

  // Fetch Revenue Data
  fetchRevenueData() {
    this.adminService.getRevenueData().subscribe({
      next: (data) => {
        console.log(data);
        this.totalRevenue = data.totalRevenue;
        this.adminCommission = data.adminCommission;
        this.averageRevenuePerEvent = data.averageRevenuePerEvent;
        this.revenuePerEvent = data.revenuePerEvent;

        // Initialize visualizations
        this.createPieChart();
        this.createBarChart();
      },
      error: (err) => console.error('Failed to fetch revenue data:', err)
    });
  }

  // Pie Chart for Total Revenue Breakdown
  createPieChart() {
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Admin Commission', 'EventManager Revenue'],
        datasets: [
          {
            data: [this.adminCommission, this.totalRevenue - this.adminCommission],
            backgroundColor: ['#42A5F5', '#66BB6A'],
            hoverBackgroundColor: ['#1E88E5', '#43A047']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: { enabled: true }
        }
      }
    });
  }

  // Bar Chart for Revenue Per Event
  createBarChart() {
    const labels = this.revenuePerEvent.map((item) => `Event ${item.eventId}`);
    const data = this.revenuePerEvent.map((item) => item.revenue);

    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Revenue Per Event',
            data: data,
            backgroundColor: '#FFCA28',
            hoverBackgroundColor: '#FFB300'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: { enabled: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
