import { CustomerRequest } from './customer-request';
import { Reservation } from './reservation';

export interface CustomerRequestDetailsResponse {
  customer: CustomerRequest;
  reservations: Reservation;
}
