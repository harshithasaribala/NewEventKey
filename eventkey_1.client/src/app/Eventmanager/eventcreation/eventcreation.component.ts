import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-eventcreation',
  standalone: false,
  
  templateUrl: './eventcreation.component.html',
  styleUrl: './eventcreation.component.css'
})
export class EventcreationComponent {
  createEventForm: FormGroup;
  eventId: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.createEventForm = this.fb.group({
      eventName: ['', [Validators.required]],
      organizer: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: [''],
      ticketPrice: [null, [Validators.required, Validators.min(1)]],
      maxAttendees: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void { }

  createEvent(): void {
    if (this.createEventForm.valid) {
      const eventData = this.createEventForm.value;

      // Call the AuthService to handle API
      this.authService.createEvent(eventData).subscribe(
        (response) => {
          this.eventId = response.eventId;
          alert('Event created successfully!');
          this.createEventForm.reset();
        },
        (error) => {
          console.error('Error creating event:', error);
          alert('Failed to create the event.');
        }
      );
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }
}
