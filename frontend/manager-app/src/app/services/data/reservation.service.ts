import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerRequest } from '../../models/customer-request';
import { CustomerDetailsResponse } from '../../models/customer-details-response';
import { PaginatedResponse } from '../../models/paginated-response';
import { Reservation } from '../../models/reservation';

const apiPath = 'api/reservations/';

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
      .append('sortField', `${sortField}`)
      .append('sortOrder', `${sortOrder}`);
    return this.http.get<PaginatedResponse>(apiPath, { params: params });
  }

  getCustomerRequestListWithUrl(pageUrl: string) {
    return this.http.get<PaginatedResponse>(pageUrl);
  }

  submitCustomerRequest(
    customer: Partial<CustomerRequest>,
    reservations: Array<Partial<Reservation>>
  ) {
    return this.http.post(apiPath, { customer, reservations });
  }

  getCustomerRequestReservations(id: number) {
    return this.http.get<CustomerDetailsResponse>(apiPath + id + '/');
  }

  confirmCustomerRequest(customer: CustomerRequest) {
    return this.http.post(apiPath + customer.id + '/', {});
  }

  deleteCustomerRequest(customer: CustomerRequest) {
    return this.http.delete(apiPath + customer.id + '/');
  }
}
