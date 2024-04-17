import { FormControl } from "@angular/forms";

export interface CustomerRequestForm {
  email: FormControl<string>;
  created: FormControl<Date>;
  flight: FormControl<number>;
  status: FormControl<number>;
}
