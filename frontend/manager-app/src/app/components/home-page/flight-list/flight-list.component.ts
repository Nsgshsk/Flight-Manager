import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgZorroModule } from '../../shared/NgZorro.module';
import { AnnoFlightService } from '../../../services/data/anno-flight.service';
import { Flight } from '../../../models/flight';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule, NgZorroModule, RouterModule],
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FlightListComponent implements OnInit {
  data: Flight[] = [];

  constructor(private annoFlightService: AnnoFlightService) {}

  ngOnInit(): void {}

  loadData(
    params: Partial<{
      type: 1 | 2 | 3 | null;
      class: 1 | 2 | 3 | null;
      departure_airport: string | null;
      arrival_airport: string | null;
      departure_date: Date | null;
      return_date: Date | null;
    }>
  ): void {
    this.annoFlightService.getFlightList(1, 100, params).subscribe({
      next: (value) => {
        this.data = value.results as Flight[];
      },
      error: (error) => console.error(error),
    });
  }
}
