import { FormControl } from "@angular/forms";

export interface FlightForm {
  departure_airport: FormControl<string>;
  arrival_airport: FormControl<string>;
  departure_datetime: FormControl<Date>;
  arrival_datetime: FormControl<Date>;
  plane: FormControl<string | number>;
  pilot_name: FormControl<string>;
  economy_seats: FormControl<number>;
  business_seats: FormControl<number>;
  first_seats: FormControl<number>;
}
