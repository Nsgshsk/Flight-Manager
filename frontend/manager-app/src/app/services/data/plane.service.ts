import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plane } from '../../models/plane';
import { PaginatedResponse } from '../../models/paginated-response';
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;
const apiPath = apiUrl + 'api/flights/planes';

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
      .append('sortField', `${sortField}`)
      .append('sortOrder', `${sortOrder}`);
    return this.http.get<PaginatedResponse>(apiPath, { params: params });
  }

  getPlaneListWithUrl(pageUrl: string) {
    return this.http.get<PaginatedResponse>(pageUrl);
  }

  createPlane(planeForm: Partial<Plane>) {
    return this.http.post(apiPath, planeForm);
  }

  gePlaneInfo(id: number) {
    this.http.get<Plane>(apiPath + id + '/');
  }

  changePlaneInfo(plane: Partial<Plane>) {
    return this.http.patch(apiPath + plane.tail_number + '/', plane);
  }

  removePlane(plane: Plane) {
    return this.http.delete(apiPath + plane.tail_number + '/');
  }
}
