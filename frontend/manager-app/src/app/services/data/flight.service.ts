import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Flight } from '../../models/flight';
import { PaginatedResponse } from '../../models/paginated-response';
import { environment } from '../../../environments/environment';
import { catchError, retry, throwError } from 'rxjs';

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
    return this.http.get<PaginatedResponse>(apiPath, { params: params }).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  getFlightListWithUrl(pageUrl: string) {
    return this.http.get<PaginatedResponse>(pageUrl).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  createFlight(flightForm: Partial<Flight>) {
    return this.http.post(apiPath, flightForm).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  getFlightInfo(id: number) {
    return this.http.get<Flight>(apiPath + id + '/').pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  changeFlightInfo(flight: Partial<Flight>) {
    return this.http.patch(apiPath + flight.id + '/', flight).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  removeFlight(flight: Flight) {
    return this.http.delete(apiPath + flight.id + '/').pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }
}
