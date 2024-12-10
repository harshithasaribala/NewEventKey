import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-adminlogin',
  standalone: false,
  templateUrl: './adminlogin.component.html',
  styleUrl: './adminlogin.component.css'
})
export class AdminloginComponent {
  adminLoginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onsubmit(): void {
    const { email, password } = this.adminLoginForm.value;

    if (email === 'admin@gmail.com' && password === 'admin') {
      console.log('Admin login successful');
      alert('Sucessful');
      this.router.navigate(['/admin-dashboard']);
    } else {
      console.error('Invalid credentials');
      alert('Invalid credentials. Please try again.');
    }
  }
}

