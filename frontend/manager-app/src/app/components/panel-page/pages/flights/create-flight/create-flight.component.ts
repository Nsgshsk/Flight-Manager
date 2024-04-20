import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgZorroModule } from '../../../../shared/NgZorro.module';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FlightForm } from '../../../../../models/flight-form';
import { FlightService } from '../../../../../services/data/flight.service';
import { PlaneSearchService } from '../../../../../services/data/plane-search.service';
import { AirportService } from '../../../../../services/data/airport.service';

@Component({
  selector: 'app-create-flight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgZorroModule],
  templateUrl: './create-flight.component.html',
  styleUrl: './create-flight.component.css',
})
export class CreateFlightComponent {
  readonly #modal = inject(NzModalRef);
  planeOptions: Array<{ value: string; text: string }> = [];
  airportOptions: Array<{ value: number; text: string }> = [];
  nzFilterOption = (): boolean => true;
  now = new Date();

  success = false;
  error = false;

  validateForm: FormGroup<FlightForm>;

  constructor(
    private fb: NonNullableFormBuilder,
    private flightService: FlightService,
    private planeService: PlaneSearchService,
    private airportService: AirportService
  ) {
    this.validateForm = this.fb.group({
      departure_airport: ['', [Validators.required]],
      arrival_airport: ['', [Validators.required]],
      departure_datetime: [this.now, [Validators.required]],
      arrival_datetime: [this.now, [Validators.required]],
      plane: [0, [Validators.required]],
      pilot_name: ['', [Validators.required]],
      economy_seats: [0, [Validators.required]],
      business_seats: [0, [Validators.required]],
      first_seats: [0, [Validators.required]],
    });
  }

  searchPlane(value: string): void {
    this.planeService.getPlaneList().subscribe((data) => {
      const listOfOption: Array<{ value: string; text: string }> = [];
      data.forEach((item) => {
        if (item.tail_number.includes(value))
          listOfOption.push({
            value: item.tail_number,
            text: item.tail_number,
          });
      });
      this.planeOptions = listOfOption;
    });
  }

  searchAirport(value: string): void {
    this.airportService.getAirportList().subscribe((data) => {
      const listOfOption: Array<{ value: number; text: string }> = [];
      data.forEach((item) => {
        if (
          item.name.includes(value) ||
          item.iata_code.includes(value) ||
          item.city.includes(value)
        )
          listOfOption.push({
            value: item.id,
            text: item.iata_code + ': ' + item.name + ', ' + item.city,
          });
      });
      this.airportOptions = listOfOption;
    });
  }

  submitForm() {
    if (this.validateForm.valid) {
      console.log(this.validateForm.value);
      this.flightService.createFlight(this.validateForm.value).subscribe({
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
