import { Reservation } from './../../../../models/reservation';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgZorroModule } from '../../../shared/NgZorro.module';
import { CustomerRequest } from '../../../../models/customer-request';
import { ReservationService } from '../../../../services/data/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-reservation-details',
  standalone: true,
  imports: [CommonModule, NgZorroModule],
  templateUrl: './reservation-details.component.html',
  styleUrl: './reservation-details.component.css',
})
export class ReservationDetailsComponent {
  customer!: CustomerRequest;
  reservations!: Reservation[];

  constructor(
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let id = params['id'];
      this.reservationService.getCustomerRequestReservations(id).subscribe({
        next: (value) => {
          this.customer = value.customer;
          this.reservations = value.reservations;
        },
        error: (err) => console.error(err),
      });
    });
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Are you sure deleting this user?',
      nzContent: '<b style="color: red;">You won\'t be able to revert it!</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.reservationService.deleteCustomerRequest(this.customer).subscribe({
          next: () =>
            setTimeout(() => {
              this.router.navigate(['admin', 'reservations']);
            }, 500),
          error: (error) => {
            console.error(error);
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
}
