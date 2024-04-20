import { Flight } from './../../../../../models/flight';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgZorroModule } from '../../../../shared/NgZorro.module';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FlightForm } from '../../../../../models/flight-form';
import { FlightService } from '../../../../../services/data/flight.service';
import { PlaneSearchService } from '../../../../../services/data/plane-search.service';
import { AirportService } from '../../../../../services/data/airport.service';

@Component({
  selector: 'app-edit-flight',
  standalone: true,
  imports: [CommonModule, NgZorroModule, ReactiveFormsModule],
  templateUrl: './edit-flight.component.html',
  styleUrl: './edit-flight.component.css',
})
export class EditFlightComponent {
  readonly #modal = inject(NzModalRef);
  readonly flight: Flight = inject(NZ_MODAL_DATA);
  planeOptions: Array<{ value: string; text: string }> = [];
  airportOptions: Array<{ value: number; text: string }> = [];
  nzFilterOption = (): boolean => true;

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
      departure_airport: [this.flight.departure_airport, [Validators.required]],
      arrival_airport: [this.flight.arrival_airport, [Validators.required]],
      departure_datetime: [
        this.flight.departure_datetime,
        [Validators.required],
      ],
      arrival_datetime: [this.flight.arrival_datetime, [Validators.required]],
      plane: [this.flight.plane as number, [Validators.required]],
      pilot_name: [this.flight.pilot_name, [Validators.required]],
      economy_seats: [this.flight.economy_seats, [Validators.required]],
      business_seats: [this.flight.business_seats, [Validators.required]],
      first_seats: [this.flight.first_seats, [Validators.required]],
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
      this.flightService.changeFlightInfo(this.validateForm.value).subscribe({
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
