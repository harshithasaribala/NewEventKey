import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionService } from '../services/session.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-feedback',
  standalone: false,
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  userId!: string;
  feedbackForm: FormGroup;
  selectedFile: File | null = null;
  uploadedPhoto: string | null = null;
  showThankYouMessage: boolean = false;
  isSubmitting: boolean = false; // Prevent double submission
  bookings: { eventId: string; eventName: string }[] = [];
  selectedEventName: string = ''; // Store the selected event name

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sessionService: SessionService
  ) {
    this.feedbackForm = this.fb.group({
      userId: ['', [Validators.required]],
      eventId: ['', [Validators.required]],
      eventName: ['', [Validators.required]],
      eventDate: ['', [Validators.required, this.dateLessThanCurrent]],
      feedbackText: ['', [Validators.required, Validators.minLength(50)]],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      imagePath: ['']
    });
  }

  ngOnInit(): void {
    const retrievedId = this.sessionService.getItem('userId');
    if (retrievedId) {
      this.userId = retrievedId;
      this.feedbackForm.controls['userId'].setValue(this.userId);
    } else {
      alert('Invalid or missing User ID in the session.');
    }
    this.fetchEventIds();

    // Watch for changes in eventId and update eventName dynamically
    this.feedbackForm.get('eventId')?.valueChanges.subscribe((eventId) => {
      this.updateEventName(eventId);
    });
  }

  setRating(rating: number): void {
    this.feedbackForm.controls['rating'].setValue(rating);
  }

  isFormValid(): boolean {
    return this.feedbackForm.valid;
  }

  dateLessThanCurrent(control: AbstractControl): { [key: string]: any } | null {
    const today = new Date();
    const eventDate = new Date(control.value);
    return eventDate >= today ? { eventDateInvalid: true } : null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedPhoto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  fetchEventIds(): void {
    this.authService.getBookingsByUserId(this.userId).subscribe(
      (bookings) => {
        this.bookings = bookings; // Store eventId and eventName pairs
      },
      (error) => {
        console.error('Error fetching event IDs:', error);
      }
    );
  }

  updateEventName(eventId: string): void {
    const selectedBooking = this.bookings.find((booking) => booking.eventId === eventId);
    this.selectedEventName = selectedBooking ? selectedBooking.eventName : '';
    this.feedbackForm.controls['eventName'].setValue(this.selectedEventName);
  }

  submitFeedback(event?: Event): void {
    if (event) {
      event.preventDefault(); // Prevent form default submission
      event.stopPropagation();
    }

    if (this.isSubmitting || !this.feedbackForm.valid) {
      return; // Prevent double submission or invalid form submission
    }

    this.isSubmitting = true; // Block multiple submissions

    const formData = new FormData();
    formData.append('UserId', this.feedbackForm.controls['userId'].value);
    formData.append('EventId', this.feedbackForm.controls['eventId'].value);
    formData.append('EventName', this.feedbackForm.controls['eventName'].value);
    formData.append('EventDate', this.feedbackForm.controls['eventDate'].value);
    formData.append('FeedbackText', this.feedbackForm.controls['feedbackText'].value);
    formData.append('Rating', this.feedbackForm.controls['rating'].value.toString());

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile, this.selectedFile.name);
    }

    this.authService.submitFeedback(formData).pipe(take(1)).subscribe(
      (response) => {
        alert('Feedback submitted successfully');
        console.log('Feedback submitted successfully:', response);
        this.showThankYouMessage = true;
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback. Please try again.');
      },
      () => {
        this.isSubmitting = false; // Reset flag after completion
      }
    );
  }

  resetForm(): void {
    this.feedbackForm.reset();
    this.selectedFile = null;
    this.uploadedPhoto = null;
    this.showThankYouMessage = false;
    this.isSubmitting = false;
    this.selectedEventName = '';
  }
}
