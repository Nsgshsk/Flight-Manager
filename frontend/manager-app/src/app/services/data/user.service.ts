import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { User } from '../../models/user';
import { PaginatedResponse } from '../../models/paginated-response';
import { environment } from '../../../environments/environment';
import { catchError, retry, throwError } from 'rxjs';

const apiUrl = environment.apiUrl;
const apiPath = apiUrl + 'api/auth/users/';

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
      .append('ordering', `${sortOrder == 'descend' ? '-' : '' + sortField}`);
    return this.http.get<PaginatedResponse>(apiPath, { params: params }).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  getUserListWithUrl(pageUrl: string) {
    return this.http.get<PaginatedResponse>(pageUrl).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  createUser(userForm: Partial<User>) {
    return this.http.post(apiPath, userForm).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  getUserInfo(id: number) {
    return this.http.get<User>(apiPath + id + '/').pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  changeUserInfo(user: Partial<User>) {
    return this.http.patch(apiPath + user.id + '/', user).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  removeUser(user: User) {
    return this.http.delete(apiPath + user.id + '/').pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }
}
