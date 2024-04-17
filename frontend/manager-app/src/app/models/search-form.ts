import { FormControl } from '@angular/forms';

export interface SearchForm {
  type: FormControl<1 | 2 | 3 | null>;
  class: FormControl<1 | 2 | 3 | null>;
  departure_airport: FormControl<string | null>;
  arrival_airport: FormControl<string | null>;
  departure_date: FormControl<Date | null>;
  return_date: FormControl<Date | null>;
}
