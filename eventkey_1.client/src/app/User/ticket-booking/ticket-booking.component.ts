import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import { SessionService } from '../../services/session.service';

declare const google: any; // Declare Google Pay global object

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
  baseCost: number = 0; // Base cost before GST
  gstAmount: number = 0; // GST amount
  totalCost: number = 0; // Total cost including GST
  userProfile: any;
  gstRate: number = 18; // GST rate in percentage

  googlePayClient: any; // Google Pay Client
  paymentRequest: any; // Google Pay Payment Request

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

    // Initialize Google Pay
    this.initGooglePay();
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
  }

  cancelBooking() {
    this.router.navigate([`/userdashboard`]);
  }


  proceedToConfirm() {
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
      bookingDate: new Date().toISOString(),
    };

    // Save booking details
    this.authService.saveBooking(bookingDetails).subscribe(
      (response: any) => {
        console.log(bookingDetails);
        alert('Booking saved successfully');

        // Update event register count after booking is saved
        this.authService.registerTickets(this.eventId, this.numberOfTickets).subscribe(
          (updateResponse: any) => {
            console.log('Register count updated successfully', updateResponse);

            // Navigate to e-ticket generation
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
        console.log(bookingDetails);
        console.error('Error saving booking:', error);
        alert('Unable to save booking details. Please try again.');
      }
    );
  }


  /** Initialize Google Pay API **/
  initGooglePay() {
    const googlePayClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });
    const paymentDataRequest = {
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
          },
        },
        {
          type: 'TOKENIZED_CARD',
          parameters: {
            allowedAuthMethods: ['CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
          },
        },
      ],
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: '10.00',
        currencyCode: 'USD',
      },
      merchantInfo: {
        merchantName: 'Example Merchant',
        merchantId: '01234567890123456789',
      },
    };

    const googlePayConfig = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['VISA', 'MASTERCARD']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'phonepe', // Replace with your gateway name
              gatewayMerchantId: 'harshithasaribala@axl' // Replace with your ID
            }
          }
        }
      ],
      merchantInfo: {
        merchantName: 'Event Booking System',
        merchantId: 'harshithasaribala@axl' // Your Google Pay Merchant ID
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: this.totalCost.toFixed(2),
        currencyCode: 'INR',
        countryCode: 'IN'
      }
    };

    this.googlePayClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });
    this.googlePayClient.isReadyToPay({
      allowedPaymentMethods: googlePayConfig.allowedPaymentMethods
    })
      .then((response: any) => {
        if (response.result) {
          console.log('Google Pay is ready');
          this.paymentRequest = googlePayConfig;
        } else {
          console.error('Google Pay is not ready');
        }
      })
      .catch((err: any) => {
        console.error('Google Pay initialization failed:', err);
      });
  }

  /** Trigger Google Pay Payment */
  onGooglePayClick() {
    if (!this.paymentRequest) {
      alert('Google Pay is not available');
      return;
    }

    const paymentDataRequest = Object.assign({}, this.paymentRequest, {
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: this.totalCost.toFixed(2), // Ensure this reflects the updated total cost
        currencyCode: 'INR',
        countryCode: 'IN'
      }
    });

    this.googlePayClient.loadPaymentData(paymentDataRequest)
      .then((paymentData: any) => {
        console.log('Payment Successful:', paymentData);
        alert('Payment successful! Booking confirmed.');
        this.proceedToConfirm();
      })
      .catch((err: any) => {
        console.error('Payment failed:', err);
        alert('Google Pay payment failed. Please try again.');
      });
  }
}
