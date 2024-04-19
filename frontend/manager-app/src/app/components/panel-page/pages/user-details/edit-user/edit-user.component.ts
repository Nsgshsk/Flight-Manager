import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { NgZorroModule } from '../../../../shared/NgZorro.module';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserForm } from '../../../../../models/user-form';
import { UserService } from '../../../../../services/data/user.service';
import { User } from '../../../../../models/user';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, NgZorroModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent {
  readonly #modal = inject(NzModalRef);
  readonly user: User = inject(NZ_MODAL_DATA);

  success = false;
  error = false;

  validateForm: FormGroup<{
    id: FormControl<number>;
    username: FormControl<string>;
    first_name: FormControl<string>;
    last_name: FormControl<string>;
    email: FormControl<string>;
    egn: FormControl<string>;
    address: FormControl<string>;
    phone_number: FormControl<string>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private userService: UserService
  ) {
    this.validateForm = this.fb.group({
      id: [this.user.id],
      username: [this.user.username, [Validators.required]],
      first_name: [this.user.first_name, [Validators.required]],
      last_name: [this.user.last_name, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      egn: [this.user.egn, [Validators.required]],
      address: [this.user.address, [Validators.required]],
      phone_number: [
        this.user.phone_number,
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
      this.userService.changeUserInfo(this.validateForm.value).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.destroyModal('User updated!');
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
