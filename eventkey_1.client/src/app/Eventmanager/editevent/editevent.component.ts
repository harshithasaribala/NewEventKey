import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-editevent',
  standalone: false,
  templateUrl: './editevent.component.html',
  styleUrls: ['./editevent.component.css']
})
export class EditeventComponent implements OnInit {
  editEventForm: FormGroup; // Form group to manage event details
  eventManagerId: string = ''; // To store the event manager ID
  eventId: string = ''; // To store the event ID
  successMessage: string = '';
  errorMessage: string = '';
  private fullEventDetails: any = {}; 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private eventService: AuthService,
    private sessionService :SessionService
  ) {
    // Initialize the form group with validators
    this.editEventForm = this.fb.group({
      eventId: [{ value: '', disabled: true }, Validators.required],
      eventName: ['', Validators.required],
      eventDate: ['', [Validators.required, this.futureDateValidator()]], // Future date validation
      eventTime: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      ticketPrice: ['', [Validators.required, Validators.min(0)]],
      maxAttendees: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // Fetch eventManagerId from route parameters
    const retrievedId = this.sessionService.getItem('eid');
    if (retrievedId) {
      this.eventManagerId = retrievedId;
    }
    if (!this.eventManagerId) {
      console.error('No event manager ID found in route parameters');
      this.router.navigate(['/login']); // Redirect to login if no manager ID
      return; // Stop further execution
    }

    // Fetch eventId from route parameters
    const eventId = this.route.snapshot.paramMap.get('eventid');
    if (eventId) {
      this.eventId = eventId;
      this.loadEventDetails(eventId); // Load details to prefill the form
    } else {
      console.error('Event ID is missing!');
      this.router.navigate([`/eventmanagerdashboard/${this.eventManagerId}/manageEvents`]);
    }
  }

  loadEventDetails(eventId: string): void {
    // Fetch event details using the service
    this.eventService.fetchEventDetails(eventId).subscribe(
      (response) => {
        this.fullEventDetails = response;
        this.editEventForm.patchValue({
          eventId: response.eventId,
          eventName: response.eventName,
          eventDate: response.eventDate, // Ensure date format matches input type="date"
          eventTime: response.eventTime,
          location: response.location,
          description: response.description,
          ticketPrice: response.ticketPrice,
          maxAttendees: response.maxAttendees,
        });
        console.log('Event details loaded and form prefilled:', response);
      },
      (error) => {
        console.error('Error fetching event details', error);
        this.router.navigate([`/eventmanagerdashboard/${this.eventManagerId}/manageEvents`]);
      }
    );
  }

  saveChanges(): void {
    if (this.editEventForm.valid) {
      const updatedEvent = {
        ...this.fullEventDetails, // Include non-editable fields
        ...this.editEventForm.getRawValue()
      };
      // Save the updated event details using the service
      this.eventService.updateEvent(this.eventId, updatedEvent).subscribe(
        () => {
          this.successMessage = 'Event updated successfully!';
          this.errorMessage = '';
          alert(this.successMessage);
          this.router.navigate([`/eventmanagerdashboard`]);
        },
        (error) => {
          console.error('Error updating event', error);
          this.errorMessage = 'Failed to update event!';
          alert(this.errorMessage);
        }
      );
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
      this.successMessage = '';
    }
  }

  cancelEdit(): void {
    // Navigate back to the manage events screen
    this.router.navigate([`/eventmanagerdashboard`]);
  }

  /**
   * Custom Validator for Event Date
   * Ensures the selected date is in the future
   */
  private futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Required validator will handle empty values
      }

      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset to start of the day for comparison

      return selectedDate >= today ? null : { futureDate: true };
    };
  }
}
