import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgZorroModule } from '../../../shared/NgZorro.module';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/data/user.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NgZorroModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  total = 1;
  listOfRandomUser: User[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;

  constructor(private userService: UserService)  {}

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.userService.getUserList(pageIndex, pageSize, sortField, sortOrder).subscribe(data => {
      this.loading = false;
      this.total = 200; // mock the total data here
      this.listOfRandomUser = data.results;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }
}
