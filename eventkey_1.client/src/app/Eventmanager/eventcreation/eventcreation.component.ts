import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-eventcreation',
  standalone: false,
  templateUrl: './eventcreation.component.html',
  styleUrls: ['./eventcreation.component.css']
})
export class EventcreationComponent implements OnInit {
  @Input() emId: string = '';  // Accept event manager ID as input
  @Input() email: string = ''; // Accept email as input
  createEventForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  eventId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private sessionService:SessionService
  ) {
    this.createEventForm = this.fb.group({
      emId: ['', Validators.required],  // The emId field will be pre-filled
      eventName: ['', Validators.required],
      eventType: ['', Validators.required],
      organizer: ['', Validators.required],
      eventDate: ['', [Validators.required, this.futureDateValidator()]], // Add custom validator for eventDate
      eventTime: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      ticketPrice: ['', [Validators.required, Validators.min(0)]],
      maxAttendees: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]] // Email validation
    });
  }

  ngOnInit(): void {
    // Fetch event manager ID from route parameters and pre-fill the form
    const retrievedId = this.sessionService.getItem('eid');
    if (retrievedId) {
      this.emId = retrievedId;
      this.createEventForm.get('emId')?.setValue(this.emId);
      // Fetch profile by event manager ID and pre-fill email in the form
      this.authService.getProfileById(this.emId).subscribe(profile => {
        this.email = profile.email; // Assuming the profile has an email field
        this.createEventForm.get('email')?.setValue(this.email);
      });
    }
  }

  createEvent(): void {
    if (this.createEventForm.valid) {
      const eventData = this.createEventForm.value;

      this.authService.createEvent(eventData).subscribe(
        (response) => {
          this.eventId = response.eventId;
          this.successMessage = 'Event created successfully!';
          this.errorMessage = ''; // Clear error message
          this.createEventForm.reset();
        },
        (error) => {
          console.error('Error creating event:', error);
          this.errorMessage = 'Failed to create the event.';
          this.successMessage = ''; // Clear success message
        }
      );
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
      this.successMessage = ''; // Clear success message
    }
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

      return selectedDate > today ? null : { futureDate: true };
    };
  }
}
