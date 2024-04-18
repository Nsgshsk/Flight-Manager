import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgZorroModule } from '../shared/NgZorro.module';
import { LoginForm } from '../../models/login-form';
import { AuthService } from '../../services/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgZorroModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  validateForm: FormGroup<LoginForm> = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  loggedIn = false;
  error = false;

  submitForm(): void {
    if (this.validateForm.valid) {
      this.loggedIn = this.auth.loginToken(this.validateForm.value);
      if (this.loggedIn)
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 500);
      else this.error = true;
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onClose() {
    this.error = false;
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}
}
