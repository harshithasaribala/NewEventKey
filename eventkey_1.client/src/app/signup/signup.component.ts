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
      eventType: [''],
      companyName: [''],
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  toggleEventType(isEventManager: boolean) {
    this.isEventManager = isEventManager;
    if (isEventManager) {
      this.SignUpFormGroup.controls['eventType'].setValidators([Validators.required]);
      this.SignUpFormGroup.controls['companyName'].setValidators([Validators.required]);
    } else {
      this.SignUpFormGroup.controls['eventType'].clearValidators();
      this.SignUpFormGroup.controls['companyName'].clearValidators();
    }
    this.SignUpFormGroup.controls['eventType'].updateValueAndValidity();
    this.SignUpFormGroup.controls['companyName'].updateValueAndValidity();
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Form submit method
  onSubmit() {
    if (this.SignUpFormGroup.valid) {
      //const { email, phoneNumber } = this.SignUpFormGroup.value;

      //// Call the checkUserExistence method
      //this.authService.checkUserExistence(email, phoneNumber).subscribe(
      //  (exists) => {
      //    if (exists) {
      //      alert('User already exists with this email or phone number!');
      //    } else {
            
            this.authService.signUp(this.SignUpFormGroup.value).subscribe(
              (response) => {
                console.log('SignUp successful', response);
                if (response) {
                  let generatedId: string;

                  if (response.eventType) {
                    generatedId = response.emId;
                  } else {
                    generatedId = response.userId;
                  }

                  const confirmationMessage = `Signup successful! Click OK to go to the login page.`;

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
      //  (error) => {
      //    console.error('Error checking user existence', error);
      //  }
      //);
    }
