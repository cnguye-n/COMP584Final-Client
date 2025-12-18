import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth-service';
import { LoginRequest } from './login-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  form!: UntypedFormGroup;

  submitting = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit(): void {
    // prevent double submit + prevent invalid submits
    if (this.submitting || this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      userName: this.form.controls['username'].value,
      password: this.form.controls['password'].value,
    };

    this.authService.login(loginRequest).subscribe({
      next: (result) => {
        console.log('Login success:', result);

        // IMPORTANT: navigate after token is stored (AuthService.login tap should store it)
        this.router.navigate(['/home']).then(() => {
          this.submitting = false;
        });
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Login failed. Please check username/password.';
        this.submitting = false;
      },
    });
  }
}
