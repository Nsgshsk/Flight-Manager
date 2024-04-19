import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResponse } from '../../models/paginated-response';
import { Flight } from '../../models/flight';
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;
const apiPath = apiUrl + 'api/flights/';

@Injectable({
  providedIn: 'root',
})
export class AnnoFlightService {
  constructor(private http: HttpClient) {}

  getFlightList(
    pageIndex: number,
    pageSize: number,
  ) {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
    return this.http.get<PaginatedResponse>(apiPath, { params: params });
  }

  getFlightListWithUrl(pageUrl: string) {
    return this.http.get<PaginatedResponse>(pageUrl);
  }

  getFlightInfo(id: number) {
    this.http.get<Flight>(apiPath + id + '/');
  }
}
