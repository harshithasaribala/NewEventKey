import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { AdminService } from '../../services/admin.service'; // Import AdminService for API calls
import { ActivatedRoute } from '@angular/router'; // To get route parameters
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from 'chart.js';

@Component({
  selector: 'app-ticket-sales',
  standalone: false,
  templateUrl: './ticket-sales.component.html',
  styleUrls: ['./ticket-sales.component.css']
})
export class TicketSalesComponent implements OnInit, AfterViewInit {

  @ViewChild('ticketSalesChart') ticketSalesChart: ElementRef | undefined; // Reference to the canvas element
  public charts: any[] = []; // To store individual charts for each event
  public revenueDetails: any[] = []; // Store revenue details for each event
  public managerId: string = ''; // Will hold the EMId from the route

  constructor(private adminService: AdminService, private route: ActivatedRoute) {
    Chart.register(
      DoughnutController,
      ArcElement,
      Tooltip,
      Legend,
      CategoryScale,
      LinearScale,
      Title
    );
  }

  ngOnInit(): void {
    // Get the manager ID from the route parameters
    this.managerId = this.route.snapshot.paramMap.get('eid')!;
    console.log(this.managerId);
    // Fetch sales data for this manager
    this.adminService.getSalesData(this.managerId).subscribe(data => {
      console.log(data); 
      // Handle the case where there might be no data
      if (!data || data.length === 0) {
        console.error('No data found for the given manager ID');
        return;
      }

      // Prepare the data and create charts
      data.forEach((eventData: any) => {
        const eventName = eventData.eventName;
        const totalTicketsBooked = eventData.totalTicketsBooked;
        const remainingTickets = eventData.remainingTickets;
        const totalRevenue = totalTicketsBooked * eventData.ticketPrice; // Assuming a property `TicketPrice`
        const adminShare = totalRevenue * 0.2;

        // Store revenue details
        this.revenueDetails.push({
          eventName,
          totalRevenue,
          adminShare
        });

        // Create a pie chart for each event
        this.charts.push(new Chart(`ticketSalesChart-${eventName}`, {
          type: 'pie',
          data: {
            labels: ['Total Tickets Booked', 'Remaining Tickets'],
            datasets: [{
              data: [totalTicketsBooked, remainingTickets],
              backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                enabled: true
              }
            }
          }
        }));
      });
    });
  }

  ngAfterViewInit(): void {
    // Ensure that the canvas elements are available after view initialization
    setTimeout(() => {
      this.charts.forEach((chart, index) => {
        const canvasElement = document.getElementById(`ticketSalesChart-${this.revenueDetails[index].eventName}`) as HTMLCanvasElement;
        if (canvasElement) {
          chart.update();
        }
      });
    });
  }
}
