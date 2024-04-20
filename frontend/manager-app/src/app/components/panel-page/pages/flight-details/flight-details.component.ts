import { Component, ViewContainerRef } from '@angular/core';
import { Flight } from '../../../../models/flight';
import { FlightService } from '../../../../services/data/flight.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { NgZorroModule } from '../../../shared/NgZorro.module';
import { EditFlightComponent } from './edit-flight/edit-flight.component';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [CommonModule, NgZorroModule, EditFlightComponent],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.css'
})
export class FlightDetailsComponent {
  flight!: Flight;

  constructor(
    private flightService: FlightService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let id = params['id'];
      this.flightService.getFlightInfo(id).subscribe({
        next: (value) => (this.flight = value),
        error: (err) => console.error(err),
      });
    });
  }

  createComponentModal(): void {
    const modal = this.modal.create<EditFlightComponent>({
      nzTitle: 'Create User',
      nzContent: EditFlightComponent,
      nzClosable: true,
      nzDraggable: true,
      nzViewContainerRef: this.viewContainerRef,
      nzData: this.flight,
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
      this.flightService.getFlightInfo(this.flight.id).subscribe({
        next: (value) => (this.flight = value),
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
        this.flightService.removeFlight(this.flight).subscribe({
          next: () =>
            setTimeout(() => {
              this.router.navigate(['admin', 'flights']);
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
