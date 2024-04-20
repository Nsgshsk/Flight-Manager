import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgZorroModule } from '../../../../shared/NgZorro.module';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { PlaneService } from '../../../../../services/data/plane.service';
import { PlaneTypeService } from '../../../../../services/data/plane-type.service';

@Component({
  selector: 'app-create-plane',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgZorroModule],
  templateUrl: './create-plane.component.html',
  styleUrl: './create-plane.component.css',
})
export class CreatePlaneComponent {
  readonly #modal = inject(NzModalRef);
  planeTypeOptions: Array<{ value: number; text: string }> = [];
  nzFilterOption = (): boolean => true;

  success = false;
  error = false;

  validateForm: FormGroup<{
    tail_number: FormControl<string>;
    type: FormControl<number>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private planeService: PlaneService,
    private planeTypeService: PlaneTypeService
  ) {
    this.validateForm = this.fb.group({
      tail_number: ['', [Validators.required, Validators.maxLength(10)]],
      type: [-1, [Validators.required]],
    });
  }

  search(value: string): void {
    this.planeTypeService.getPlaneTypeList().subscribe((data) => {
      const listOfOption: Array<{ value: number; text: string }> = [];
      data.forEach((item) => {
        if (item.name.includes(value))
          listOfOption.push({
            value: item.id,
            text: item.name,
          });
      });
      this.planeTypeOptions = listOfOption;
    });
  }

  submitForm() {
    if (this.validateForm.valid) {
      console.log(this.validateForm.value);
      this.planeService.createPlane(this.validateForm.value).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.destroyModal('Plane created!');
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
