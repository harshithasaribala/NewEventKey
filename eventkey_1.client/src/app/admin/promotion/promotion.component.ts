import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import * as bootstrap from 'bootstrap';
import { BehaviorSubject } from 'rxjs';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface Account {
  id: string;
  emId: string;
  fullName: string;
  email: string;
  selected: boolean;
}

@Component({
  selector: 'app-promotion',
  standalone: false,
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
  accounts$: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]); // Reactive state for accounts
  selectedUserType: string = 'User';
  isLoading: boolean = false;
  errorMessage: string = '';
  selectAll: boolean = false;
  emailSent: boolean = false;
  emailSubject: string = "Discover EventKey: Unlock your Perfect Experience";
  emailBody: string = `
  <p>Dear {{fullName}},</p>
  <p>Are you looking for an all-in-one solution to manage your events with ease? Look no further! We are excited to introduce EventKey, your go-to platform for seamless event planning and management.</p>
  <p>With EventKey, you can:</p>
  <ul>
    <li>Create and manage events effortlessly</li>
    <li>Track registrations and attendee lists in real-time</li>
    <li>Send invitations and reminders automatically</li>
    <li>Analyze event performance with insightful reports</li>
  </ul>
  <p>As a User, EventKey offers you a personalized dashboard with exciting features, including:</p>
  <ul>
    <li>Search and explore a wide variety of events based on your interests</li>
    <li>Book tickets with ease and receive instant e-tickets</li>
    <li>Save your favorite events for future reference</li>
    <li>Access an exclusive Rewards Zone featuring leaderboards, a gaming zone, and exciting rewards</li>
    <li>Share valuable feedback to help improve the platform and enhance your experience</li>
  </ul>
  <p>Don’t miss out on making your events extraordinary. Whether you're planning an event or simply looking for unforgettable experiences, EventKey is here to simplify it all. Visit EventKey today and start your journey toward seamless event management!</p>
  <p>Best regards,<br>The EventKey Team</p>
`;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.fetchAccounts();
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
      selected: this.selectAll,
    }));
    this.accounts$.next(updatedAccounts);
  }

  openEmailModal(): void {
    const modal = document.getElementById('emailModal');
    if (modal) {
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  sendEmails(): void {
    const selectedAccounts = this.accounts$.value.filter((account) => account.selected);

    if (selectedAccounts.length === 0) {
      alert('Please select at least one user.');
      return;
    }

    this.isLoading = true;

    // Map each selected account to an Observable for sending the email
    const emailRequests = selectedAccounts.map((account) => {
      const personalizedEmailBody = this.emailBody.replace('{{fullName}}', account.fullName);

      return this.adminService.sendPromotionEmail({
        subject: this.emailSubject,
        body: personalizedEmailBody,
        recipients: [account.email],
      }).pipe(
        catchError((error) => {
          // Handle individual errors for specific accounts
          console.error(`Failed to send email to ${account.email}:`, error);
          return of({ email: account.email, success: false, error });
        }),
        map(() => ({ email: account.email, success: true }))
      );
    });

    // Combine all Observables into a single Observable
    forkJoin(emailRequests).subscribe({
      next: (results) => {
        this.isLoading = false;

        // Process results to determine success and failures
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

        console.log('Email send results:', results);
      },
      error: (error) => {
        // Handle unexpected errors during the entire process
        this.isLoading = false;
        alert('An unexpected error occurred. Please check the console for details.');
        console.error('Unexpected error:', error);
      },
    });
  }

}
