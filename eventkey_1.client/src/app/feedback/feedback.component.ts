
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-feedback',
  standalone:false,
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  userId!: string;
  feedbackForm: FormGroup;
  selectedFile: File | null = null;
  uploadedPhoto: string | null = null;
  showThankYouMessage: boolean = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService) {
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
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    if (this.userId) {
      this.feedbackForm.controls['userId'].setValue(this.userId);
    } else {
      alert('Invalid or missing User ID in the URL.');
    }
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

  submitFeedback(): void {
    if (this.feedbackForm.valid) {
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

      this.authService.submitFeedback(formData).subscribe(
        (response) => {
          console.log('Feedback submitted successfully:', response);
          this.showThankYouMessage = true;
          this.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.error('Error submitting feedback:', error);
          alert('Error submitting feedback. Please try again.');
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }

  resetForm(): void {
    this.feedbackForm.reset();
    this.selectedFile = null;
    this.uploadedPhoto = null;
    this.showThankYouMessage = false;
  }
}
