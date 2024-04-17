import { CustomerRequest } from './customer-request';
import { Flight } from './flight';
import { Plane } from './plane';
import { User } from './user';

export interface PaginatedResponse {
  count: number;
  next: string;
  previous: string;
  results: User[] | Plane[] | Flight[] | CustomerRequest[];
}
