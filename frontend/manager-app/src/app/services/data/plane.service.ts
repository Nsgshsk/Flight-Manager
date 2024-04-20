import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plane } from '../../models/plane';
import { PaginatedResponse } from '../../models/paginated-response';
import { environment } from '../../../environments/environment';
import { catchError, retry, throwError } from 'rxjs';

const apiUrl = environment.apiUrl;
const apiPath = apiUrl + 'api/flights/planes/';

@Injectable({
  providedIn: 'root',
})
export class PlaneService {
  constructor(private http: HttpClient) {}

  getPlaneList(
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

  getPlaneListWithUrl(pageUrl: string) {
    return this.http.get<PaginatedResponse>(pageUrl).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  createPlane(planeForm: Partial<Plane>) {
    return this.http.post(apiPath, planeForm).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  gePlaneInfo(id: string) {
    return this.http.get<Plane>(apiPath + id + '/').pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  changePlaneInfo(plane: Partial<Plane>) {
    return this.http.patch(apiPath + plane.tail_number + '/', plane).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  removePlane(plane: Plane) {
    return this.http.delete(apiPath + plane.tail_number + '/').pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }
}
