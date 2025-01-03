import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { format } from 'date-fns';
@Component({
  selector: 'app-ticket-booking',
  standalone: false,
  templateUrl: './ticket-booking.component.html',
  styleUrls: ['./ticket-booking.component.css']
})
export class TicketBookingComponent implements OnInit {
  userId!: string;
  eventId!: string;
  userName: string = '';
  event: any;
  numberOfTickets: number = 1;
  baseCost: number = 0;
  gstAmount: number = 0;
  totalCost: number = 0;
  userProfile: any;
  gstRate: number = 18;

  googlePayPaymentRequest: any;
  transactionId: string = ''; // To store the transaction ID
  paymentStatus: string = ''; // To store the payment status
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private sessionService: SessionService,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.eventId = params.get('eventid') || '';
      if (this.eventId) {
        this.fetchEventDetails(this.eventId);
      } else {
        console.error('No event ID found in route parameters');
        this.router.navigate(['/login']);
      }
    });

    const retrievedId = this.sessionService.getItem('userId');
    if (retrievedId) {
      this.userId = retrievedId;
      this.getUserProfile(this.userId);
    } else {
      console.error('No user ID found in session storage');
      this.router.navigate(['/login']);
    }
  }

  getUserProfile(userId: string): void {
    this.authService.getProfileById(userId).subscribe(
      (response) => {
        this.userProfile = response;
        this.userName = response.fullName;
      },
      (error) => {
        console.error('Error fetching user profile', error);
        this.router.navigate(['/login']);
      }
    );
  }

  fetchEventDetails(eventId: string): void {
    this.authService.fetchEventDetails(eventId).subscribe(
      (response) => {
        this.event = response;
        this.updateTotalCost();
      },
      (error) => {
        console.error('Error fetching event details:', error);
      }
    );
  }

  updateTotalCost() {
    this.baseCost = this.numberOfTickets * this.event.ticketPrice;
    this.gstAmount = (this.baseCost * this.gstRate) / 100;
    this.totalCost = this.baseCost + this.gstAmount;

    // Update Google Pay Payment Request
    this.googlePayPaymentRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'razorpay',
              gatewayMerchantId: 'PYzGWGz4fjFHF3'
            }
          }
        }
      ],
      merchantInfo: {
        merchantId: 'BCR2DN4TX7V2F2TQ',
        merchantName: 'EventKey'
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: this.totalCost.toFixed(2),
        currencyCode: 'INR',
        countryCode: 'IN'
      }
    };
  }

  onLoadPaymentData(event: any) {
    console.log('Payment Success:', event.detail);

    // Extract transaction details
    const paymentData = event.detail.paymentMethodData.tokenizationData.token; // Tokenization data contains transaction info
    this.transactionId = paymentData; // Use paymentData or specific transaction ID field
    this.paymentStatus = 'Success'; // Payment status is 'Success' if callback is triggered successfully

    // Show alert with transaction ID and status
    alert(`Payment Successful!\n\nTransaction ID: ${this.transactionId}\nPayment Status: ${this.paymentStatus}\n\nThank you for your payment!`);

    this.proceedToConfirm();
  }

  cancelBooking() {
    this.router.navigate([`/userdashboard`]);
  }

  
  proceedToConfirm() {
    // Update the booking date
    const bookingDate = format(new Date(), 'yyyy-MM-dd'); // Get the current date in the desired format

    // Prepare the booking details
    const bookingDetails = {
      userId: this.userId,
      eventId: this.eventId,
      numberOfTickets: this.numberOfTickets,
      baseCost: this.baseCost,
      gstAmount: this.gstAmount,
      totalAmount: this.totalCost,
      eventName: this.event.eventName,
      eventDate: this.event.eventDate,
      eventTime: this.event.eventTime,
      ticketPrice: this.event.ticketPrice,
      eventLocation: this.event.location,
      bookingDate: bookingDate, // Set the updated booking date here
    };

    // Save the booking details
    this.authService.saveBooking(bookingDetails).subscribe(
      (response: any) => {
        console.log('Booking Details:', bookingDetails);
        alert('Booking saved successfully');

        // After booking is saved, update the event register count
        this.authService.registerTickets(this.eventId, this.numberOfTickets).subscribe(
          (updateResponse: any) => {
            console.log('Register count updated successfully', updateResponse);

            // Navigate to e-ticket generation page
            this.router.navigate([`/userdashboard/eventdetails/${this.eventId}/ticketbooking/eticket`], {
              state: { event: this.event, tickets: this.numberOfTickets },
            });
          },
          (updateError) => {
            console.error('Error updating register count:', updateError);
            alert('Booking saved, but there was an error updating the event details.');
          }
        );
      },
      (error) => {
        console.log('Booking Details:', bookingDetails);
        console.error('Error saving booking:', error);
        alert('Unable to save booking details. Please try again.');
      }
    );
  }

}
