import { Component, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  NzDatePickerComponent,
  NzDatePickerModule,
} from 'ng-zorro-antd/date-picker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzIconModule,
    NzSpaceModule,
    NzButtonModule,
    NzCardModule,
    NzFlexModule,
    NzFormModule,
    NzSelectModule,
    NzGridModule,
    NzInputModule,
    NzAutocompleteModule,
    NzDatePickerModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  // data
  ticketTypes = [
    { label: 'Round trip', value: 'round-trip' },
    { label: 'One way', value: 'one-way' },
    { label: 'Multi-city', value: 'multi-city', disabled: true },
  ];
  ticketClasses = [
    { label: 'Economy', value: 'economy' },
    { label: 'Business', value: 'business' },
    { label: 'First', value: 'first' },
  ];
  cities = ['Sofia', 'Varna', 'Rome', 'London'];

  flightSearchForm: FormGroup;
  filteredDepartureCities: string[] = [];
  filteredArrivalCities: string[] = [];

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  constructor(private fb: FormBuilder) {
    this.flightSearchForm = this.fb.group({
      type: [
        'round-trip' as 'round-trip' | 'one-way',
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
    if (!startValue || !this.flightSearchForm.controls['returnDate'].value) {
      return false;
    }
    return (
      startValue.getTime() >
      this.flightSearchForm.controls['returnDate'].value.getTime()
    );
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.flightSearchForm.controls['departureDate'].value) {
      return false;
    }
    return (
      endValue.getTime() <=
      this.flightSearchForm.controls['departureDate'].value.getTime()
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
