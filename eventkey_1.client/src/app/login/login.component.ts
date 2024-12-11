import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

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
            this.handleLoginSuccess(response.userId, '/userdashboard', 'userId');
          } else if (formData.userType === 'EventManager') {
            this.handleLoginSuccess(response.eid, '/eventmanagerdashboard', 'eid');
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
      sessionStorage.setItem(storageKey, id);
      // Use Router's navigate to pass the userId or eid as a route parameter
      this.router.navigate([redirectPath, id]);  // Passing id as route parameter
    } else {
      alert('Unable to retrieve user ID. Please try again.');
    }
  }

  onReset(): void {
    this.loginForm.reset();
  }
}
