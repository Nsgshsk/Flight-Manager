import { FormControl } from "@angular/forms";

export interface ReservationForm {
  customer_request: FormControl<number>;
  first_name: FormControl<string>;
  middle_name: FormControl<string>;
  last_name: FormControl<string>;
  egn: FormControl<string>;
  phone_number: FormControl<string>;
  nationality: FormControl<string | number>;
  type: FormControl<number>;
}
