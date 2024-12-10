import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  SignUpFormGroup: FormGroup;
  isEventManager = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService  // Inject the service
  ) {
    this.SignUpFormGroup = this.fb.group({
      userType: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      eventType: [''],
      companyName: ['']
    });
  }
  ngOnInit(): void {
    this.SignUpFormGroup.get('password')?.valueChanges.subscribe(() => {
      const confirmPassword = this.SignUpFormGroup.get('confirmPassword');
      if (confirmPassword && confirmPassword.value !== this.SignUpFormGroup.get('password')?.value) {
        confirmPassword.setErrors({ mismatch: true });
      }
    });
  }
  toggleEventType(isEventManager: boolean): void {
    this.isEventManager = isEventManager;
    if (!isEventManager) {
      this.SignUpFormGroup.patchValue({
        eventType: '',
        companyName: ''
      });
    }
  }
  // Form submit method
  onSubmit() {
    if (this.SignUpFormGroup.valid) {
      const userData = this.SignUpFormGroup.value;

      // Call signUp method from the service to send data to the API
      this.authService.signUp(userData).subscribe(
        (response) => {
          console.log('SignUp successful', response);
          if (response && response.id) {
            const generatedId = response.id;  // Replace with correct response field
            const confirmationMessage = `Signup successful! Your generated ID is: ${generatedId}. Click OK to go to the login page.`;
            if (confirm(confirmationMessage)) {
              this.router.navigate(['/login']);
            }
          } else {
            console.log('Error: Response does not contain an ID');
          }
        },
        (error) => {
          console.error('Error during sign up', error);
        }
      );

    }
  }
}
