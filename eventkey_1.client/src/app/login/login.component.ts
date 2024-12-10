import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    console.log(this.router.url);
    this.loginForm = this.fb.group({
      userType: ['', Validators.required],  // 'User' or 'EventManager'
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  toggleEventType(isEventManager: boolean): void {
    console.log('Event Manager selected:', isEventManager);
  }
  onLogin(): void {
    if (this.loginForm.valid) {
      const formData = {
        userType: this.loginForm.value.userType, // 'User' or 'EventManager'
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      console.log("Login payload: ", formData);

      this.authService.login(formData).subscribe({
        next: (response) => {
          console.log('Login successful', response);

          if (this.loginForm.value.userType == "User") {
            alert(`Welcome,${response['userDetails'].fullName}`);

            sessionStorage.setItem('userDetails', JSON.stringify(response['userDetails']));
            sessionStorage.setItem('userId', response['userDetails'].id);
            this.router.navigate(['/userdashboard']);
          }
          if (this.loginForm.value.userType == "EventManager") {
            alert(`Welcome,${response['eventManagerDetails'].fullName}`);
            sessionStorage.setItem('eventManager', JSON.stringify(response['eventManagerDetails']));
            sessionStorage.setItem('Id', response['eventManagerDetails'].emid);
            this.router.navigate(['/eventmanagerdashboard']);
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

  onReset(): void {
    this.loginForm.reset();
  }
}
