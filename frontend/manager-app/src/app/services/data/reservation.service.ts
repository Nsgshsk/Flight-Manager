import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerRequest } from '../../models/customer-request';
import { CustomerRequestForm } from '../../models/customer-request-form';
import { ReservationForm } from '../../models/reservation-form';

const apiPath = 'api/';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  getCustomerRequests(pageUrl: string) {
    return this.http.get<CustomerRequest[]>(pageUrl);
  }

  submitCustomerRequest(
    customer: CustomerRequestForm,
    reservations: ReservationForm[]
  ) {
    return this.http.post(apiPath, { customer, reservations });
  }

  getCustomerRequestReservations(id: number) {
    return this.http.get;
  }

  confirmCustomerRequest(id: number) {
    return this.http.post(apiPath + id + '/', {});
  }

  deleteCustomerRequest(id: number) {
    return this.http.delete(apiPath + id + '/');
  }
}
