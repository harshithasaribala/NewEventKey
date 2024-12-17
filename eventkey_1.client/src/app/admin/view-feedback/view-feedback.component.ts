import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Feedback } from '../../feedback/feedback.model';

@Component({
  selector: 'app-view-feedback',
  standalone: false,
  
  templateUrl: './view-feedback.component.html',
  styleUrl: './view-feedback.component.css'
})
export class ViewFeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(private feedbackService: AdminService) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (data) => {
        this.feedbacks = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load feedbacks.';
        this.loading = false;
      }
    });
  }

  deleteFeedback(eventId: string): void {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbackService.deleteFeedback(eventId).subscribe({
        next: () => {
          this.feedbacks = this.feedbacks.filter(f => f.eventId !== eventId);
          alert('Feedback deleted successfully.');
        },
        error: () => alert('Failed to delete feedback.')
      });
    }
  }
}
