import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgZorroModule } from '../shared/NgZorro.module';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from '../../services/data/reservation.service';
import { Nationality } from '../../models/nationality';
import { NationalityService } from '../../services/data/nationality.service';

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [CommonModule, NgZorroModule, ReactiveFormsModule],
  templateUrl: './reservation-page.component.html',
  styleUrl: './reservation-page.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ReservationPageComponent {
  private flight_id?: number;
  ticketClasses = [
    { label: 'Economy', value: 1 },
    { label: 'Business', value: 2 },
    { label: 'First', value: 3 },
  ];
  nzFilterOption = (): boolean => true;
  nationalityOptions: Nationality[] = [];

  validationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private nationalityService: NationalityService
  ) {
    this.route.params.subscribe(
      (params) => (this.flight_id = params['id'] as number)
    );
    this.validationForm = this.fb.group({
      email: [
        '',
        {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        },
      ],
      flight: this.flight_id as number,
      reservations: this.fb.array([
        this.fb.group({
          first_name: [
            '',
            { nonNullable: true, validators: [Validators.required] },
          ],
          middle_name: ['', { validators: [Validators.required] }],
          last_name: [
            '',
            { nonNullable: true, validators: [Validators.required] },
          ],
          egn: [
            '',
            {
              nonNullable: true,
              validators: [Validators.required, Validators.minLength(10)],
            },
          ],
          phone_number: [
            '',
            {
              nonNullable: true,
              validators: [
                Validators.required,
                Validators.pattern(
                  String.raw`^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$`
                ),
              ],
            },
          ],
          nationality: [
            '',
            { nonNullable: true, validators: [Validators.required] },
          ],
          type: [
            1 as 1 | 2 | 3,
            { nonNullable: true, validators: [Validators.required] },
          ],
        }),
      ]),
    });
  }

  searchNationality(value: string) {
    this.nationalityService.getNationalityList().subscribe({
      next: (value) => (this.nationalityOptions = value),
      error: (error) => console.error(error),
    });
  }

  get reservations() {
    return this.validationForm.get('reservations') as FormArray;
  }

  getFormGroup(i: any) {
    return i as FormGroup;
  }

  addField(e?: MouseEvent): void {
    e?.preventDefault();
    const reservationArray = this.validationForm.get(
      'reservations'
    ) as FormArray;
    if (reservationArray.length == 10) {
      alert('No more than 10 reservations!');
      return;
    }
    reservationArray.push(
      this.fb.group({
        first_name: [
          '',
          { nonNullable: true, validators: [Validators.required] },
        ],
        middle_name: ['', { validators: [Validators.required] }],
        last_name: [
          '',
          { nonNullable: true, validators: [Validators.required] },
        ],
        egn: [
          '',
          {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(10)],
          },
        ],
        phone_number: [
          '',
          {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.pattern(
                String.raw`^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$`
              ),
            ],
          },
        ],
        nationality: [
          '',
          { nonNullable: true, validators: [Validators.required] },
        ],
        type: [
          1 as 1 | 2 | 3,
          { nonNullable: true, validators: [Validators.required] },
        ],
      })
    );
  }

  removeField(e: MouseEvent): void {
    e.preventDefault();
    const reservationArray = this.validationForm.get(
      'reservations'
    ) as FormArray;
    if (reservationArray.length > 1) {
      reservationArray.removeAt(reservationArray.length - 1);
    }
  }

  submitForm(): void {
    if (this.validationForm.valid) {
      this.reservationService.submitCustomerRequest(this.validationForm.value).subscribe();
    } else {
      Object.values(this.validationForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
