import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Flight } from '../../models/flight';
import { PaginatedResponse } from '../../models/paginated-response';
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;
const apiPath = apiUrl + 'api/flights/list/';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
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
      .append('ordering', `${sortOrder == 'descend' ? '-' : '' + sortField}`);
    return this.http.get<PaginatedResponse>(apiPath, { params: params });
  }

  getFlightListWithUrl(pageUrl: string) {
    return this.http.get<PaginatedResponse>(pageUrl);
  }

  createFlight(flightForm: Partial<Flight>) {
    return this.http.post(apiPath, flightForm);
  }

  getFlightInfo(id: number) {
    this.http.get<Flight>(apiPath + id + '/');
  }

  changeFlightInfo(flight: Partial<Flight>) {
    return this.http.patch(apiPath + flight.id + '/', flight);
  }

  removeFlight(flight: Flight) {
    return this.http.delete(apiPath + flight.id + '/');
  }
}
