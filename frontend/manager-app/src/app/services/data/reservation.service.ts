import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerRequest } from '../../models/customer-request';
import { CustomerDetailsResponse } from '../../models/customer-details-response';
import { PaginatedResponse } from '../../models/paginated-response';
import { Reservation } from '../../models/reservation';
import { environment } from '../../../environments/environment';
import { catchError, retry, throwError } from 'rxjs';

const apiUrl = environment.apiUrl;
const apiPath = apiUrl + 'api/reservations/';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  getCustomerRequestList(
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

  getCustomerRequestListWithUrl(pageUrl: string) {
    return this.http.get<PaginatedResponse>(pageUrl).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  submitCustomerRequest(form: {
    email: string;
    flight: number;
    reservations: Array<Partial<Reservation>>;
  }) {
    return this.http
      .post(apiPath, {
        customer: { email: form.email, flight_id: form.flight },
        reservations: form.reservations,
      })
      .pipe(
        retry(3),
        catchError((error) => throwError(() => error))
      );
  }

  getCustomerRequestReservations(id: number) {
    return this.http.get<CustomerDetailsResponse>(apiPath + id + '/').pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  confirmCustomerRequest(customer: CustomerRequest) {
    return this.http.post(apiPath + customer.id + '/', {}).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }

  deleteCustomerRequest(customer: CustomerRequest) {
    return this.http.delete(apiPath + customer.id + '/').pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }
}
