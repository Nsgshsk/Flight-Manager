import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NgZorroModule } from '../shared/NgZorro.module';
import { FlightListComponent } from './flight-list/flight-list.component';
import { SearchForm } from '../../models/search-form';
import { AirportService } from '../../services/data/airport.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgZorroModule,
    FlightListComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  // data
  ticketTypes = [
    { label: 'One way', value: 1 },
    { label: 'Round trip', value: 2, disabled: true },
    { label: 'Multi-city', value: 3, disabled: true },
  ];
  ticketClasses = [
    { label: 'Economy', value: 1 },
    { label: 'Business', value: 2 },
    { label: 'First', value: 3 },
  ];
  cityCountryList: string[] = [];
  now = new Date();

  flightSearchForm: FormGroup<SearchForm>;
  filteredDepartureCityCountryList: string[] = [];
  filteredArrivalCityCountryList: string[] = [];
  nzFilterOption = (): boolean => true

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  constructor(private fb: FormBuilder, private airportService: AirportService) {
    airportService.getAirportList().subscribe({
      next: data => {
        this.cityCountryList = $.map(data, (value) => {
          return value.city + ', ' + value.country
        })
      },
      error: err => {
        console.log(err)
        of([])
      }
    })
    this.flightSearchForm = this.fb.group({
      type: [
        1 as 1 | 2 | 3,
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ],
      class: [
        1 as 1 | 2 | 3,
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ],
      departure_airport: [
        'Sofia, Bulgaria',
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ],
      arrival_airport: [
        '',
        {
          nonNullable: true,
          validators: [],
        },
      ],
      departure_date: [null as Date | null],
      return_date: [null as Date | null],
    });
    this.filteredDepartureCityCountryList = this.cityCountryList;
    this.filteredArrivalCityCountryList = this.cityCountryList;
    this.now.setHours(0, 0, 0, 0);
  }

  onTypeChange(value: number) {
    if (value == 1 && this.flightSearchForm.controls['return_date'].value)
      this.flightSearchForm.controls['return_date'].setValue(null);
  }

  onChangeDeparture(value: string) {
    this.filteredDepartureCityCountryList = this.cityCountryList.filter(
      (option) => option.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onChangeArrival(value: string) {
    this.filteredArrivalCityCountryList = this.cityCountryList.filter(
      (option) => option.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  disabledStartDate = (startValue: Date): boolean => {
    const isBeforeNow = startValue < this.now;
    if (!startValue || !this.flightSearchForm.controls['return_date'].value) {
      return isBeforeNow;
    }
    return (
      startValue.getTime() >
        this.flightSearchForm.controls['return_date'].value.getTime() ||
      isBeforeNow
    );
  };

  disabledEndDate = (endValue: Date): boolean => {
    const isBeforeNow = endValue < this.now;
    if (!endValue || !this.flightSearchForm.controls['departure_date'].value) {
      return isBeforeNow;
    }
    return (
      endValue.getTime() <=
        this.flightSearchForm.controls['departure_date'].value.getTime() ||
      isBeforeNow
    );
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
    console.log('handleStartOpenChange', open);
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }
}
