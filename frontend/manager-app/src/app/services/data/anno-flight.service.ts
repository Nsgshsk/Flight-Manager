import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResponse } from '../../models/paginated-response';
import { Flight } from '../../models/flight';

const apiPath = 'api/flights/';

@Injectable({
  providedIn: 'root',
})
export class AnnoFlightService {
  constructor(private http: HttpClient) {}

  getFlightList(
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

  getFlightListWithUrl(pageUrl: string) {
    return this.http.get<PaginatedResponse>(pageUrl);
  }

  getFlightInfo(id: number) {
    this.http.get<Flight>(apiPath + id + '/');
  }
}
