import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgZorroModule } from '../../../shared/NgZorro.module';
import { CustomerRequest } from '../../../../models/customer-request';
import { ReservationService } from '../../../../services/data/reservation.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, NgZorroModule, RouterModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ReservationsComponent {
  total = 1;
  requestList: CustomerRequest[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;

  constructor(
    private reservationService: ReservationService,
  ) {}

  ngOnInit(): void {
    this.loadDataFromServer(1, 10, null, null, []);
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.reservationService
      .getCustomerRequestList(pageIndex, pageSize, sortField, sortOrder)
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.total = data.count;
          this.requestList = data.results as CustomerRequest[];
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
        },
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }
}
