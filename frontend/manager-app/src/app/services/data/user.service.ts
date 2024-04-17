import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { of } from 'rxjs';
import { User } from '../../models/user';
import { UserForm } from '../../models/user-form';

const apiPath = 'api/auth/users/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  getUserList(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null
  ) {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
      .append('sortField', `${sortField}`)
      .append('sortOrder', `${sortOrder}`);
    return this.http.get(apiPath, { params: params });
  }

  getUserListWithUrl(pageUrl: string) {
    return this.http.get(pageUrl);
  }

  createUser(userForm: UserForm) {
    return this.http.post(apiPath, userForm);
  }

  getUserInfo(id: number) {
    return this.http.get<User>(apiPath + id + '/');
  }

  changeUserInfo(user: User) {
    return this.http.patch(apiPath + user.id + '/', user);
  }

  removeUser(user: User) {
    return this.http.delete(apiPath + user.id + '/');
  }
}
