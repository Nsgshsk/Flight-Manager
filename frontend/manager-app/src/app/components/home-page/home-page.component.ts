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
    { label: 'One way', value: 'one-way' },
    { label: 'Round trip', value: 'round-trip', disabled: true },
    { label: 'Multi-city', value: 'multi-city', disabled: true },
  ];
  ticketClasses = [
    { label: 'Economy', value: 'economy' },
    { label: 'Business', value: 'business' },
    { label: 'First', value: 'first' },
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
        'one-way' as 'one-way' | 'round-trip' | 'multi-city',
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ],
      class: [
        'economy' as 'economy' | 'business' | 'first',
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

  onTypeChange(value: string) {
    if (value == 'one-way' && this.flightSearchForm.controls['returnDate'].value)
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
