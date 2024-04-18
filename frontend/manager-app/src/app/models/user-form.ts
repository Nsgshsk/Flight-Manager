import { FormControl } from '@angular/forms';

export interface UserForm {
  username: FormControl<string>;
  first_name: FormControl<string>;
  last_name: FormControl<string>;
  password: FormControl<string>;
  email: FormControl<string>;
  egn: FormControl<string>;
  address: FormControl<string>;
  phone_number: FormControl<string>;
}
