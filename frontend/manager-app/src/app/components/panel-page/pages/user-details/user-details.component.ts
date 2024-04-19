import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgZorroModule } from '../../../shared/NgZorro.module';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/data/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, NgZorroModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  user!: User;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let id = params['id'];
      this.userService.getUserInfo(id).subscribe({
        next: (value) => (this.user = value),
        error: (err) => console.error(err),
      });
    });
  }

  createComponentModal(): void {
    const modal = this.modal.create<EditUserComponent>({
      nzTitle: 'Create User',
      nzContent: EditUserComponent,
      nzClosable: true,
      nzDraggable: true,
      nzViewContainerRef: this.viewContainerRef,
      nzData: this.user,
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
      this.userService.getUserInfo(this.user.id).subscribe({
        next: (value) => (this.user = value),
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
        this.userService.removeUser(this.user).subscribe({
          next: () =>
            setTimeout(() => {
              this.router.navigate(['admin', 'users']);
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
