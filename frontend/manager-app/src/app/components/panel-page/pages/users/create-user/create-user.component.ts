import { Component, inject } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserForm } from '../../../../../models/user-form';
import { CommonModule } from '@angular/common';
import { NgZorroModule } from '../../../../shared/NgZorro.module';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { UserService } from '../../../../../services/data/user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, NgZorroModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent {
  readonly #modal = inject(NzModalRef);

  success = false;
  error = false;

  passwordErrorMessage =
    'Password must meet the following requirements: \n' +
    '- Must be at least 8 characters long \n' +
    '- Must contain at least one uppercase letter \n' +
    '- Must contain at least one lowercase letter \n' +
    '- Must contain at least one number \n' +
    '- Must contain at least one special character';

  validateForm: FormGroup<UserForm>;

  constructor(
    private fb: NonNullableFormBuilder,
    private userService: UserService
  ) {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            String.raw`^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&+=*.\-_]){8,}$`
          ),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      egn: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone_number: [
        '',
        [
          Validators.required,
          Validators.pattern(
            String.raw`^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$`
          ),
        ],
      ],
    });
  }

  submitForm() {
    if (this.validateForm.valid) {
      this.userService.createUser(this.validateForm.value).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.destroyModal('User created!');
          }, 1000);
        },
        error: (err) => {
          console.error(err);
          this.error = true;
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  destroyModal(data: string | null) {
    this.#modal.destroy({ data });
  }

  onClose() {
    this.error = false;
  }
}
