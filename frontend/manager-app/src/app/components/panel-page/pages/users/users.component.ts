import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgZorroModule } from '../../../shared/NgZorro.module';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/data/user.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { of } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateUserComponent } from './create-user/create-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NgZorroModule, CreateUserComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UsersComponent implements OnInit {
  total = 1;
  userList: User[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;

  constructor(
    private userService: UserService,
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
    this.userService
      .getUserList(pageIndex, pageSize, sortField, sortOrder)
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.total = data.count;
          this.userList = data.results as User[];
        },
        error: (err) => {
          console.error(err);
          of(this.userList);
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
    const modal = this.modal.create<CreateUserComponent>({
      nzTitle: 'Create User',
      nzContent: CreateUserComponent,
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
    modal.afterClose.subscribe((result) =>
      console.log('[afterClose] The result is:', result)
    );
  }
}
