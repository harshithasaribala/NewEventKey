import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import {
  Chart,
  BarController,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
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

  constructor(private adminService: AdminService) {
    Chart.register(BarController, Tooltip, Legend, CategoryScale, LinearScale, Title);
  }

  ngOnInit(): void {
    this.fetchRevenueData();
  }

  // Fetch Revenue Data
  fetchRevenueData() {
    this.adminService.getRevenueDatas().subscribe((data) => {
      this.totalRevenue = data.totalRevenue;
      this.adminCommission = this.totalRevenue * 0.2;
      this.createRevenueChart(data.monthlyRevenue);
    });
  }

  // Revenue Chart
  createRevenueChart(monthlyRevenue: { month: string; revenue: number }[]) {
    const labels = monthlyRevenue.map((item) => item.month);
    const data = monthlyRevenue.map((item) => item.revenue);

    new Chart('revenueChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Revenue Collected',
            data: data,
            backgroundColor: '#66BB6A',
            hoverBackgroundColor: '#43A047',
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
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
