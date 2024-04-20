import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgZorroModule } from '../../../shared/NgZorro.module';
import { CreateFlightComponent } from './create-flight/create-flight.component';
import { Flight } from '../../../../models/flight';
import { FlightService } from '../../../../services/data/flight.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, NgZorroModule, CreateFlightComponent, RouterModule],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FlightsComponent implements OnInit {
  total = 1;
  flightList: Flight[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;

  constructor(
    private flightService: FlightService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
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
    this.flightService
      .getFlightList(pageIndex, pageSize, sortField, sortOrder)
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.total = data.count;
          this.flightList = data.results as Flight[];
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

  createComponentModal(): void {
    const modal = this.modal.create<CreateFlightComponent>({
      nzTitle: 'Create User',
      nzContent: CreateFlightComponent,
      nzClosable: true,
      nzDraggable: true,
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: 'Cancel',
          onClick: (componentInstance) => {
            componentInstance!.destroyModal(null);
          },
        },
        {
          label: 'Submit',
          type: 'primary',
          onClick: (componentInstance) => {
            componentInstance!.submitForm();
          },
        },
      ],
    });
    const instance = modal.getContentComponent();
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // Return a result when closed
    modal.afterClose.subscribe((result) => {
      console.log('[afterClose] The result is:', result);
      this.loadDataFromServer(1, 10, null, null, []);
    });
  }
}
