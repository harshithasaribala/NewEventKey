import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service'; // Import the SessionService

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sessionService: SessionService, // Inject SessionService
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userType: ['', Validators.required], // 'User' or 'EventManager'
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  toggleEventType(isEventManager: boolean): void {
    console.log('Event Manager selected:', isEventManager);
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Login payload: ', formData);

      this.authService.login(formData).subscribe({
        next: (response) => {
          console.log('Login successful', response);

          // Handle redirection and storage based on userType
          if (formData.userType === 'User') {
            this.handleLoginSuccess(response.userId, 'userdashboard', 'userId');
          } else if (formData.userType === 'EventManager') {
            this.handleLoginSuccess(response.eid, 'eventmanagerdashboard', 'eid');
          } else {
            alert('Invalid user type.');
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          alert('Invalid credentials');
        },
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }

  handleLoginSuccess(id: string, redirectPath: string, storageKey: string): void {
    if (id) {
      alert(`Welcome, ${id}`);
      this.sessionService.setItem(storageKey, id); // Use SessionService to store the ID
      this.router.navigate([redirectPath]); // Navigate to the dashboard
    } else {
      alert('Unable to retrieve user ID. Please try again.');
    }
  }

  onReset(): void {
    this.loginForm.reset();
  }
}
