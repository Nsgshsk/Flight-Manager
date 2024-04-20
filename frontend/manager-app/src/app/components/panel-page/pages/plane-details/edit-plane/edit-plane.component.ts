import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgZorroModule } from '../../../../shared/NgZorro.module';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Plane } from '../../../../../models/plane';
import { PlaneService } from '../../../../../services/data/plane.service';
import { PlaneTypeService } from '../../../../../services/data/plane-type.service';

@Component({
  selector: 'app-edit-plane',
  standalone: true,
  imports: [CommonModule, NgZorroModule, ReactiveFormsModule],
  templateUrl: './edit-plane.component.html',
  styleUrl: './edit-plane.component.css'
})
export class EditPlaneComponent {
  readonly #modal = inject(NzModalRef);
  readonly plane: Plane = inject(NZ_MODAL_DATA);
  planeTypeOptions: Array<{ value: number; text: string }> = [];
  nzFilterOption = (): boolean => true;

  success = false;
  error = false;

  validateForm: FormGroup<{
    tail_number: FormControl<string>,
    type: FormControl<number>
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private planeService: PlaneService,
    private planeTypeService: PlaneTypeService
  ) {
    this.validateForm = this.fb.group({
      tail_number: [this.plane.tail_number, [Validators.required, Validators.maxLength(10)]],
      type: [this.plane.type as number, [Validators.required]]
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
      this.planeService.changePlaneInfo(this.validateForm.value).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.destroyModal('Plane updated!');
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
