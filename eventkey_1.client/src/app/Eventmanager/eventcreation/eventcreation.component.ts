import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.createEventForm = this.fb.group({
      emId: ['', Validators.required],  // The emId field will be pre-filled
      eventName: ['', Validators.required],
      organizer: ['', Validators.required],
      eventDate: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      ticketPrice: ['', [Validators.required, Validators.min(0)]],
      maxAttendees: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]] // Email validation
    });
  }

  ngOnInit(): void {
    if (this.emId) {
      this.createEventForm.get('emId')?.setValue(this.emId); // Pre-fill emId in the form
    }
    if (this.email) {
      this.createEventForm.get('email')?.setValue(this.email); // Pre-fill email in the form
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
}
