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

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgZorroModule],
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
  cities = ['Sofia', 'Varna', 'Rome', 'London'];
  now = new Date();

  flightSearchForm: FormGroup;
  filteredDepartureCities: string[] = [];
  filteredArrivalCities: string[] = [];

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  constructor(private fb: FormBuilder) {
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
      departureFrom: [
        'Sofia',
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ],
      arrivalAt: [''],
      departureDate: [null as Date | null],
      returnDate: [null as Date | null],
    });
    this.filteredDepartureCities = this.cities;
    this.filteredArrivalCities = this.cities;
    this.now.setHours(0, 0, 0, 0);
  }

  onTypeChange(value: number) {
    if (value == 1 && this.flightSearchForm.controls['returnDate'].value)
      this.flightSearchForm.controls['returnDate'].setValue(null);
  }

  onChangeDeparture(value: string) {
    this.filteredDepartureCities = this.cities.filter(
      (option) => option.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onChangeArrival(value: string) {
    this.filteredArrivalCities = this.cities.filter(
      (option) => option.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  disabledStartDate = (startValue: Date): boolean => {
    const isBeforeNow = startValue < this.now;
    if (!startValue || !this.flightSearchForm.controls['returnDate'].value) {
      return isBeforeNow;
    }
    return (
      startValue.getTime() >
        this.flightSearchForm.controls['returnDate'].value.getTime() ||
      isBeforeNow
    );
  };

  disabledEndDate = (endValue: Date): boolean => {
    const isBeforeNow = endValue < this.now;
    if (!endValue || !this.flightSearchForm.controls['departureDate'].value) {
      return isBeforeNow;
    }
    return (
      endValue.getTime() <=
        this.flightSearchForm.controls['departureDate'].value.getTime() ||
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
