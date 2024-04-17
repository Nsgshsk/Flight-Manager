import { CustomerRequest } from './customer-request';
import { Reservation } from './reservation';

export interface CustomerDetailsResponse {
  customer: CustomerRequest;
  reservations: Reservation[];
}
