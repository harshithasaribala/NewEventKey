import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import * as bootstrap from 'bootstrap';

interface Account {
  id: string;
  fullName: string;
  email: string;
  selected: boolean;
}

@Component({
  selector: 'app-event-promotion',
  standalone: false,
  templateUrl: './event-promotion.component.html',
  styleUrls: ['./event-promotion.component.css']
})
export class EventPromotionComponent implements OnInit {
  accounts$: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  events$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]); // Store events
  selectedEvent: any = {}; // Store selected event
  selectedUserType: string = 'User';
  eventManagerId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  selectAll: boolean = false;
  emailSubject: string = '';
  emailBody: string = '';

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    const retrievedId = this.sessionService.getItem('eid');
    if (retrievedId) {
      this.eventManagerId = retrievedId;
      if (this.eventManagerId) {
        this.fetchEvents(); // Fetch events for the event manager
        this.fetchAccounts(); // Fetch accounts for the selected user type
      } else {
        console.error('No event manager ID found in route parameters');
        this.router.navigate(['/login']);
      }
    }
  }

  fetchEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.getEventsByManagerId(this.eventManagerId).subscribe(
      (data: any[]) => {
        this.events$.next(data);
        this.isLoading = false;
      },
      (error: any) => {
        this.errorMessage = 'Failed to fetch events. Please try again.';
        this.isLoading = false;
      }
    );
  }

  fetchAccounts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.adminService.getAccounts(this.selectedUserType).subscribe(
      (data: Account[]) => {
        const updatedAccounts = data.map((account) => ({ ...account, selected: false }));
        this.accounts$.next(updatedAccounts);
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch accounts. Please try again.';
        this.isLoading = false;
      }
    );
  }

  toggleAll(): void {
    const updatedAccounts = this.accounts$.value.map((account) => ({
      ...account,
      selected: this.selectAll
    }));
    this.accounts$.next(updatedAccounts);
  }

  openEmailModal(): void {
    const modalElement = document.getElementById('emailModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('emailModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }
  get isAnyAccountSelected(): boolean {
    return this.accounts$.value.some(account => account.selected);
  }
  onEventSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const eventId = target.value;
    console.log('Available Events:', this.events$.value);
    console.log('Selected Event ID:', eventId);

    this.selectedEvent = this.events$.value.find(e => e.eventId === eventId);

    if (this.selectedEvent) {
      console.log('Selected Event:', this.selectedEvent);
      const eventDate = this.selectedEvent.eventDate
        ? new Date(this.selectedEvent.eventDate).toLocaleDateString('en-US', {
          weekday: 'long', // Full day name
          year: 'numeric',
          month: 'long', // Full month name
          day: 'numeric',
        })
        : 'N/A';
      // Update email subject and body dynamically
      this.emailSubject = `Special Invitation: Join us for ${this.selectedEvent.eventName || 'Your Event'}!`;
      this.emailBody = `
      <p>Dear <strong>{{fullName}}</strong>,</p>
      <p>We are excited to invite you to our upcoming event: <strong>${this.selectedEvent.eventName || ''}</strong></p>
      <p><strong>Event Description:</strong> ${this.selectedEvent.description || ''}</p>
      <p><strong>Event Date:</strong> ${eventDate}</p>
      <p><strong>Location:</strong> ${this.selectedEvent.location || ''}</p>
      <p>This is a great opportunity to learn, network, and grow! Don’t miss out on this amazing event.</p>
      <p><a style="color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Book Your Ticket Now!</a></p>
      <p>We look forward to seeing you at the event!</p>
      <p>Best Regards, <br>Your Event Team</p>
    `;
    } else {
      console.error('No event found with the selected ID.');
    }
  }

  sendEmails(): void {
    const selectedAccounts = this.accounts$.value.filter((account) => account.selected);

    if (selectedAccounts.length === 0) {
      alert('Please select at least one user.');
      return;
    }

    if (!this.selectedEvent || !this.selectedEvent.eventName) {
      alert('Please select an event to promote.');
      return;
    }

    this.isLoading = true;

    const emailRequests = selectedAccounts.map((account) => {
      const personalizedEmailBody = this.emailBody.replace('{{fullName}}', account.fullName || 'Guest');

      return this.adminService
        .sendPromotionEmail({
          subject: this.emailSubject,
          body: personalizedEmailBody,
          recipients: [account.email]
        })
        .pipe(
          catchError((error) => {
            console.error(`Failed to send email to ${account.email}:`, error);
            return of({ email: account.email, success: false, error });
          }),
          map(() => ({ email: account.email, success: true }))
        );
    });

    forkJoin(emailRequests).subscribe({
      next: (results) => {
        this.isLoading = false;
        const failedEmails = results.filter((result) => !result.success);
        if (failedEmails.length > 0) {
          alert(
            `Some emails failed to send. Check the console for details.\nFailed emails: ${failedEmails
              .map((result) => result.email)
              .join(', ')}`
          );
          console.error('Failed emails:', failedEmails);
        } else {
          alert('All emails sent successfully!');
        }
      },
      error: (error) => {
        this.isLoading = false;
        alert('An unexpected error occurred. Please check the console for details.');
        console.error('Unexpected error:', error);
      }
    });
  }
}
