import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResponse } from '../../models/paginated-response';
import { Flight } from '../../models/flight';
import { environment } from '../../../environments/environment';
import { catchError, retry, throwError } from 'rxjs';

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
    searchParams: Partial<{
      type: 1 | 2 | 3 | null;
      class: 1 | 2 | 3 | null;
      departure_airport: string | null;
      arrival_airport: string | null;
      departure_date: Date | null;
      return_date: Date | null;
    }>
  ) {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
      .append('type', `${searchParams.type}`)
      .append('class', `${searchParams.class}`)
      .append('departure_location', `${searchParams.departure_airport}`)
      .append('arrival_location', `${searchParams.arrival_airport}`)
      .append('departure_date', `${searchParams.departure_date}`);
    return this.http.get<PaginatedResponse>(apiPath, { params: params }).pipe(
      retry(3),
      catchError((err) => throwError(() => err))
    );
  }

  getFlightListWithUrl(pageUrl: string) {
    return this.http.get<PaginatedResponse>(pageUrl);
  }

  getFlightInfo(id: number) {
    this.http.get<Flight>(apiPath + id + '/');
  }
}
