import { Component, ViewContainerRef } from '@angular/core';
import { Plane } from '../../../../models/plane';
import { PlaneService } from '../../../../services/data/plane.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditPlaneComponent } from './edit-plane/edit-plane.component';
import { NgZorroModule } from '../../../shared/NgZorro.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plane-details',
  standalone: true,
  imports: [EditPlaneComponent, NgZorroModule, CommonModule],
  templateUrl: './plane-details.component.html',
  styleUrl: './plane-details.component.css',
})
export class PlaneDetailsComponent {
  plane!: Plane;

  constructor(
    private planeService: PlaneService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let id: string = params['id'];
      this.planeService.gePlaneInfo(id).subscribe({
        next: (value) => (this.plane = value),
        error: (err) => console.error(err),
      });
    });
  }

  createComponentModal(): void {
    const modal = this.modal.create<EditPlaneComponent>({
      nzTitle: 'Create User',
      nzContent: EditPlaneComponent,
      nzClosable: true,
      nzDraggable: true,
      nzViewContainerRef: this.viewContainerRef,
      nzData: this.plane,
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
      this.planeService.gePlaneInfo(this.plane.tail_number).subscribe({
        next: (value) => (this.plane = value),
        error: (err) => console.error(err),
      });
    });
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Are you sure deleting this plane?',
      nzContent: '<b style="color: red;">You won\'t be able to revert it!</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.planeService.removePlane(this.plane).subscribe({
          next: () =>
            setTimeout(() => {
              this.router.navigate(['admin', 'planes']);
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
