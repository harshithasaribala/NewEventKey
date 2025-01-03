import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-ticket-sales',
  standalone: false,
  templateUrl: './ticket-sales.component.html',
  styleUrls: ['./ticket-sales.component.css']
})
export class TicketSalesComponent implements OnInit, AfterViewInit {
  @ViewChildren('ticketSalesChart') chartElements!: QueryList<ElementRef>;

  public revenueDetails: any[] = []; // Array to store revenue details
  public managerId: string = ''; // Manager ID

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {
    // Register required Chart.js components
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Title);
  }

  ngOnInit(): void {
    const retrievedId = this.sessionService.getItem('eid');
    if (retrievedId) {
      this.managerId = retrievedId;
    }

    this.fetchSalesData();
  }

  ngAfterViewInit(): void {
    // Render charts after DOM elements are ready
    setTimeout(() => {
      if (!this.revenueDetails || this.revenueDetails.length === 0) {
        console.error('No revenue details available for chart rendering.');
        return;
      }

      this.chartElements.forEach((chartElement, index) => {
        const canvas = chartElement.nativeElement as HTMLCanvasElement;
        const event = this.revenueDetails[index];

        if (canvas) {
          new Chart(canvas, {
            type: 'doughnut',
            data: {
              labels: ['Total Tickets Booked', 'Remaining Tickets'],
              datasets: [{
                data: [event.totalTicketsBooked, event.remainingTickets],
                backgroundColor: ['#36A2EB', '#FF6384'],
                borderColor: ['#36A2EB', '#FF6384'],
                borderWidth: 1,

              }]
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
        } else {
          console.error('Canvas not found for event:', event.eventName);
        }
      });
    }, 500); // Delay to ensure DOM is rendered
  }

  fetchSalesData() {
    this.adminService.getSalesData(this.managerId).subscribe((data: any) => {
      if (!data || data.length === 0) {
        console.error('No sales data available');
        return;
      }

      this.revenueDetails = data.map((eventData: any) => ({
        eventName: eventData.eventName,
        totalTicketsBooked: eventData.totalTicketsBooked,
        remainingTickets: eventData.remainingTickets,
        totalRevenue: eventData.totalTicketsBooked * eventData.ticketPrice,
        adminShare: (eventData.totalTicketsBooked * eventData.ticketPrice) * 0.2
      }));
    });
  }
}
